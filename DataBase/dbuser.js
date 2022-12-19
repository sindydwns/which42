// replaceLocationStatus = ok
// deleteAllLocationTable = ok //삭제할 여지가 있음
// deleteLocationTable = ok
// isExistIntraId //삭제할 여지가 있음
// registerNewClient = ok
// getIntraIdbySlackId = ok
// getUsersLocationInfo = ok
// getGroupLocationInfo = ok 미확인
// getUserInfo = ok
// insertGroup
// deleteGroup
// insertMember
// deleteMember


import Sequelize from "sequelize";
import sequelize from "../setting.js";
import LocationStatus from "../models/locationStatus.js";
import User from "../models/user.js";
import GroupMember from "../models/groupMember.js"


/**
 * table from 42api of All Active Location
 * @param {Array<string>} table
 * @returns 
 */
export async function replaceLocationStatus(table) {
	const keys = Object.keys(table);
	if (keys.length == 0) return;
  
	await sequelize.transaction(transaction => {
		return LocationStatus.bulkCreate(keys.map(x => ({ targetId: x, host: table[x] })), {
			fields: ['targetId', 'host'],
			updateOnDuplicate: ['host'],
			transaction
		});
	});
}

export async function deleteAllLocationTable() {
  try {
	await LocationStatus.truncate();
	return true;
  } catch (e) {
	console.error(e);
	return false;
  }
}


// export async function deleteLocationTable(targets) {
// 	if (targets == null) {
// 	  try {
// 		await LocationStatus.destroy({ where: {} });
// 		return true;
// 	  } catch (e) {
// 		console.error(e);
// 		return false;
// 	  }
// 	} else if (targets.length == 0) {
// 	  return true;
// 	} else {
// 	  try {
// 		await LocationStatus.destroy({ where: { targetId: targets } });
// 		return true;
// 	  } catch (e) {
// 		console.error(e);
// 		return false;
// 	  }
// 	}
// }

export async function deleteLocationTable(targets) {
	if (targets == null) return false;
	if (targets.length == 0) return true;
  
	try {
	  // Use the destroy method of the LocationStatus model to delete records
	  await LocationStatus.destroy({
		where: {
		  targetId: {
			[Sequelize.Op.in]: targets
		  }
		}
	  });
	  return true;
	} catch (e) {
	  console.error(e);
	  return false;
	}
  }
  

export async function isExistIntraId(intraId) {
	const user = await User.findByPk(intraId);
	return user !== null;
  }

export async function registerNewClient(intraId, slackId) {
	const user = await User.findByPk(intraId);
	if (user) {
	  await user.update({ slackId: slackId });
	} else {
	  await User.create({ intraId: intraId, slackId: slackId });
	}
  }

export async function getIntraIdbySlackId(slackId) {
	const user = await User.findOne({ where: { slackId: slackId } });
	return user ? user.intraId : null;
  }

export async function getUsersLocationInfo(targetIds) {
	let locationInfo = [];
	for (const targetId of targetIds) {
	  const locationStatus = await LocationStatus.findByPk(targetId);
	  if (locationStatus) {
		locationInfo.push({ targetId: locationStatus.targetId, host: locationStatus.host });
	  } else {
		locationInfo.push({ targetId: targetId, host: null });
	  }
	}
	return locationInfo;
  }
  
export async function getGroupLocationInfo(seekerId, groupId) {
	const groupMembers = await Group.findOne({
	  where: { seekerId, groupId },
	  include: [
		{
		  model: GroupMember,
		  include: [
			{
			  model: LocationStatus,
			  required: false,
			  attributes: ['host']
			}
		  ],
		  attributes: ['targetId']
		}
	  ]
	}).groupMembers;
	return groupMembers.map(member => ({
	  targetId: member.targetId,
	  host: member.locationStatus ? member.locationStatus.host : null
	}));
  }

  export async function getUserInfo(intraId) {
	const user = await User.findOne({
	  where: { intraId }
	});
	return user;
  }
  