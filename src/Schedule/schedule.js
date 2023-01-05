import _schedule from "node-schedule";
import api42 from "./api42.js";
import { postDM2User } from "../apiSlack.js";
import * as dbuser from "../DataBase/dbUser.js";
import * as dbalarm from "../DataBase/dbAlarm.js";
import scheduleObjs from "../constants.js";

async function getAllpageInfo(path, params) {
	let total = [];
	for (let i = 0; i < 99; i++) {
		const config = { 
			params:{
			...params,
			"page[number]": i + 1,
		}};
		try {
			const data = await api42("GET", path, config);
			if (data.length == 0)
				break;
			total = [...total, ...data];
		} catch (e) {
			console.error(e);
			return null;
		}
	}
	return total;
}

const campusId = 29;
export const schedule = {
    loadLocations: (delay) => {
		let last = 0;
		if (delay == null)
			return ;
        _schedule.scheduleJob(`*/${+delay} * * * * *`, async () => {
			try {
				// update location
				const now = new Date();
				const total = last == 0 ?
					await getAllActiveLocation(campusId) :
					await getChangedLocation(campusId, last, now);
				if (total == null) {
					last = 0;
					dbalarm.insertErrorLog("42API ERROR");
					throw "42API ERROR";
				}
				const deleteTargets = total.reduce((acc, cur) => {
					if (cur.end_at != null)
						acc.push(cur.user.login);
					return acc;
				}, []);
				if (last == 0)
					dbuser.deleteAllLocationTable();
				else
					dbuser.deleteLocationTable(deleteTargets);
				const locationTable = total.reduce((acc, cur) => {
					if (cur.end_at == null)
						acc[cur.user.login] = cur.host;
					return acc;
				}, {});
				await dbuser.replaceLocationStatus(locationTable);
				last = now;

				// alarm
				const alarms = await dbalarm.getAllReservedAlarm();
				console.log("todo alarm", alarms);
				for (let id in alarms)
					if (alarms[id].notify_slack_id)
						postDM2User(alarms[id].notify_slack_id, `${alarms[id].target_id} is online on ${alarms[id].host}`);
				await dbalarm.deleteReservedAlarm(alarms.map(x => x.alarm_id));
			} catch(e) {
				console.error(e);
			}
        });
    },
	statisticHost: (delay) => {
		if (delay == null)
			return;
		_schedule.scheduleJob(`45 59 */${+delay} * * *`, async () => {
			try {
				console.log(`${new Date()} | statisticHost`);
				const total = await getAllActiveLocation(campusId);
				const studentCount = total.reduce((acc, cur) => {
					const cluster = /c(\d+)r\d+s\d+/.exec(cur.host)[1];
					if (cluster == null)
						return acc;
					acc[cluster] = acc[cluster] == null ? 1 : acc[cluster] + 1;
					return acc;
				}, {});
				const maxCluster = 10;
				const statisticHost = [...Array(maxCluster).keys()]
					.map((x, i) => [i + 1, studentCount[i + 1] ?? 0]);
				await dbalarm.insertStatisticHost(statisticHost);
			} catch(e) {
				console.error(e);
			}
		});
	}
};

async function getAllActiveLocation(campusId) {
	const path = `/v2/campus/${campusId}/locations`;
	return await getAllpageInfo(path, scheduleObjs.getAllActiveLocationParams)
}

async function getChangedLocation(campusId, past, now) {
	const path = `/v2/campus/${campusId}/locations`;
	return [
		...(await getAllpageInfo(path, scheduleObjs.getChangedLocationLoginFunc(past, now))),
		...(await getAllpageInfo(path, scheduleObjs.getChangedLocationLogoutFunc(past, now)))
	];
}
