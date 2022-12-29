import Sequelize from "sequelize";
import sequelize from "../setting.js";
import LocationStatus from "../models/locationStatus.js";
import User from "../models/user.js";
import Group from "../models/group.js";
import GroupMember from "../models/groupMember.js";

/**
 * Replaces the location statuses of the specified targets with the provided table.
 * @param {Object} table An object containing target IDs as keys and host locations as values.
 * @returns {Promise} A promise that resolves when the location statuses have been replaced.
 */
<<<<<<< HEAD
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
=======
 export async function replaceLocationStatus(table) {
	const keys = Object.keys(table);
	if (keys.length == 0)
		return;

	await sequelize.transaction(transaction => {
		return LocationStatus.bulkCreate(keys.map(x => ({ targetId: x, host: table[x] })), {
			fields: ['targetId', 'host'],
			updateOnDuplicate: ['host'],
			transaction
		});
	});
>>>>>>> d08af29 (시퀄라이저 적용 완료 and 주석처리)
}

/**
 * Deletes all rows from the location table.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the rows were successfully deleted, or `false` if an error occurred.
 */
export async function deleteAllLocationTable() {
<<<<<<< HEAD
  try {
    await LocationStatus.truncate();
    return true;
  } catch (e) {
    console.error(e);
    return false;
=======
	try {
	  await LocationStatus.truncate();
	  return true;
	} catch (e) {
	  console.error(e);
	  return false;
	}
>>>>>>> d08af29 (시퀄라이저 적용 완료 and 주석처리)
  }
  

/**
 * Deletes rows from the location table for the specified targets.
 * @param {string[]} targets An array of target IDs.
 * @returns {Promise<boolean>} A promise that resolves to `true` if the rows were successfully deleted, or `false` if an error occurred.
 */
export async function deleteLocationTable(targets) {
    if (targets == null) return false;
    if (targets.length == 0) return true;
  
<<<<<<< HEAD
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
  
/**
 * check existed intraId in User table
 * @param {String} intraId 
 * @returns 
 */
export async function isExistIntraId(intraId) {
    const user = await User.findByPk(intraId);
    return user !== null;
  }
=======
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
>>>>>>> d08af29 (시퀄라이저 적용 완료 and 주석처리)

/**
 * Determines if a user with the specified Intranet ID exists.
 * @param {string} intraId The Intranet ID to check.
 * @returns {Promise<boolean>} A promise that resolves to `true` if a user with the specified Intranet ID exists, or `false` if no such user exists.
 */
<<<<<<< HEAD
export async function registerNewClient(intraId, slackId) {
    const user = await User.findByPk(intraId);
    if (user) {
      await user.update({ slackId: slackId });
    } else {
      await User.create({ intraId: intraId, slackId: slackId });
    }
  }
=======
 export async function isExistIntraId(intraId) {
	const user = await User.findByPk(intraId);
	return user !== null;
}
/**
 * Registers a new client with the specified Intranet ID and Slack ID.
 * If a user with the specified Intranet ID already exists, their Slack ID will be updated.
 * If no such user exists, a new user will be created with the specified Intranet and Slack IDs.
 * @param {string} intraId The Intranet ID of the client to register.
 * @param {string} slackId The Slack ID of the client to register.
 * @returns {Promise} A promise that resolves when the registration is complete.
 */
 export async function registerNewClient(intraId, slackId) {
	const user = await User.findByPk(intraId);
	if (user) {
	  await user.update({ slackId: slackId });
	} else {
	  await User.create({ intraId: intraId, slackId: slackId });
	}
}
>>>>>>> d08af29 (시퀄라이저 적용 완료 and 주석처리)

/**
 * Returns the Intranet ID of the user with the specified Slack ID.
 * If no such user exists, returns null.
 * @param {string} slackId The Slack ID of the user.
 * @returns {(string|null)} The Intranet ID of the user, or null if no such user exists.
 */
<<<<<<< HEAD
export async function getIntraIdbySlackId(slackId) {
    const user = await User.findOne({ where: { slackId: slackId } });
    return user ? user.intraId : null;
  }
=======
 export async function getIntraIdbySlackId(slackId) {
	const user = await User.findOne({ where: { slackId: slackId } });
	return user ? user.intraId : null;
}

>>>>>>> d08af29 (시퀄라이저 적용 완료 and 주석처리)

/**
 * Returns location information for the specified user IDs.
 * @param {string[]} targetIds An array of user IDs.
 * @returns {Object[]} An array of objects containing location information for the specified user IDs. Each object has the following properties:
 * - `targetId`: the user ID.
 * - `host`: the hostname of the user's current location, or null if no location information is available for the user.
 */
 export async function getUsersLocationInfo(targetIds) {
<<<<<<< HEAD
    // Find all records in the LocationStatus model that have a targetId
    // value that is included in the targetIds array
    const locationInfo = await LocationStatus.findAll({
      where: { targetId: targetIds },
      // Specify which columns to select
      attributes: ['targetId', 'host'],
    });
  
    const updatedLocationInfo = targetIds.map(targetId => {
      const location = locationInfo.find(info => info.targetId === targetId);
      return location || { targetId, host: null };
    });
  
    return updatedLocationInfo.map(item => JSON.parse(JSON.stringify(item)));
  }

/**
 * Retrieves location information for members of a group.
 *
 * @param {string} seekerId - The ID of the seeker.
 * @param {string} groupId - The ID of the group.
 * @returns {Array.<Object>} An array of objects containing the target ID and host information for each group member.
 */
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

/**
 * get User Info.
 * @param {String} intraId 
 * @returns {String} user.intraId
 */
export async function getUserInfo(intraId) {
const user = await User.findOne({
    where: { intraId }
});
return user;
=======
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

/**
 * Retrieves the location information for the members of a group.
 * @param {string} intraId - The intraId of the user who owns the group.
 * @param {number} groupId - The ID of the group.
 * @returns {Array} An array of objects, where each object has the following properties:
 *   - targetId {string}: The intraId of a group member.
 *   - host {string}: The host of the group member's location, or null if the location is unknown.
 */
export async function getGroupLocationInfo(intraId, groupId) {
	const group = await Group.findOne({ where: { groupId } });
	if (!group || group.intraId !== intraId) {
	  return [];
	}
	const groupMembers = await GroupMember.findAll({ where: { groupId } });
	const targetIds = groupMembers.map(member => member.targetId);
	if (targetIds.length === 0) {
	  return [];
	}
	const locations = await LocationStatus.findAll({ where: { targetId: targetIds } });
	const locationMap = new Map();
	for (const location of locations) {
	  locationMap.set(location.targetId, location);
	}
	return targetIds.map(targetId => {
	  const location = locationMap.get(targetId);
	  return { targetId, host: location ? location.host : null };
	});
  }

/**
 * Get the user information for the given intraId
 * @param {string} intraId - The intraId of the user to get information for
 * @returns {Object} The user information, or null if no user was found
 */
 export async function getUserInfo(intraId) {
	const user = await User.findOne({
	  where: { intraId }
	});
	return user;
>>>>>>> d08af29 (시퀄라이저 적용 완료 and 주석처리)
}
