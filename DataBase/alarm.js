import { Alarm, ErrorLog, StatisticsHost } from "./models/index.js";
import { sequelize } from "./setting.js";

/**
 * @param {string} intraId
 * @return {Array<object>}
 */
export async function getAlarmList(intraId) {
	try {
		const alarmList = await Alarm.findAll({
			attributes: ['targetId'],
			where: {
				intraId
			}
		});
		return alarmList;
	}
	catch (e) {
		console.error(e);
		return (false);
	}
}

/**
 * @param {string} intraId 
 * @param {string|Array<string>} targetId 
 * @returns {boolean}
 */
export async function insertAlarm(intraId, targetId) {
	targetId = Array.isArray(targetId) ? targetId : [targetId];
	const values = targetId.map(x => ({ intraId, targetId: x }));
	try {
		await Alarm.bulkCreate(values);
		return (true);
	}
	catch (e) {
		console.error(e);
		return (false);
	}
}

/**
 * @param {string} intraId
 * @param {string|Array<string>} targetId
 * @returns {boolean}
 */
export async function deleteAlarm(intraId, targetId) {
	targetId = Array.isArray(targetId) ? targetId : [targetId];
	try {
		await Alarm.destroy({
			where: {
			intraId,
			targetId,
		}
		})
		return (true);
	}
	catch (e) {
		console.error(e);
		return (false);
	}
}

/**
 * 
 * @param {Array<integer>} ids 
 * @returns {void}
 */
export async function deleteReservedAlarm(ids) {
	if (ids.length == 0)
		return ;
	await Alarm.destroy({
		where: {
			alarmId: ids,
		}
	})
}