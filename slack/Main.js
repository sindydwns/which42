import { reflectWhetherSelected } from "../DataBase/utils.js";
import { getSeekerId, getUserNamebySlackId } from "./utils/data.js";
import { mainHomeView, groupManageHomeView, alarmManageHomeView, memberManageHomeView, manualHomeView, selectGlanceUserModalView } from "./views.js";

export default (app) => {

    app.event("app_home_opened", async ({ event, client, logger }) => {
        try {
            const seekerId = await getSeekerId(null, event, client);

            const result = await client.views.publish({
                user_id: event.user,
                view: await mainHomeView(seekerId),
            });
        } catch (error) {
            logger.error(error);
        }
    });

    app.action("selectGlanceTarget", async ({ ack, body, client, logger }) => {
        await ack();
        const selected = body.actions[0].selected_option;
        const seekerId = await getSeekerId(body, null, client);

		if (selected.value == "selectUserFromWorkspace")
		{
			await reflectWhetherSelected(seekerId, null);
			try {
				const result = await client.views.open({
					trigger_id: body.trigger_id,
					view: await selectGlanceUserModalView(),
				});
			} catch (error) {
				logger.error(error);
			}
		}
		else {
			await reflectWhetherSelected(seekerId, selected.value);
        	await client.views.update({
				view_id: body.view.id,
				hash: body.view.hash,
				view: await mainHomeView(seekerId),
			});
		}
		client.previous_view_id = body.view.id;
    });

	app.view({callback_id:'callbackSelectGlanceUser', type:'view_submission'}, async ({ ack, body, view, client, logger }) => {
		await ack();
		const selectedUsers = view['state']['values'][view.blocks[0].block_id]['selectDone-GlanceUser']['selected_users'];
        const seekerId = await getSeekerId(body, null, client);

		let targetIds = [];
		for (const slackId of selectedUsers) {
			const targetId = await getUserNamebySlackId(client, slackId);
			targetIds.push(targetId);
		}
		try {
			const result = await client.views.update({
				view_id: client.previous_view_id,
				view: await mainHomeView(seekerId, targetIds),
			});
		} catch (e) {
			logger.error(e);
		}
	});

    app.action("selectDone-GlanceUser", async ({ ack, body, client, logger }) => {
		await ack();
		// const selectedUsers = view['state']['values'][view.blocks[0].block_id];
		console.log("유저 하나 선택...");
	});

	app.action("goMainView", async ({ack, body, client}) => {
		await ack();
		const seekerId = await getSeekerId(body, null, client);
		await client.views.update({
			view_id: body.view.id,
			hash: body.view.hash,
			view: await mainHomeView(seekerId)
			})
		}
	);

    app.action("goGroupManageView", async ({ ack, body, client, logger }) => {
        try {
            await ack();
            const seekerId = await getSeekerId(body, null, client);
			
            await client.views.update({
                view_id: body.view.id,
                hash: body.view.hash,
                view: await groupManageHomeView(seekerId),
            });
        } catch (error) {
            logger.error(error);
        }
		client.previous_view_id = body.view.id;
    });

	app.action("goAlarmManageView", async ({ack, body, client, logger}) => {
		await ack();
		const seekerId = await getSeekerId(body, null, client);

		await client.views.update({
			view_id: body.view.id,
			hash: body.view.hash,
			view : await alarmManageHomeView(seekerId),
		});
		client.previous_view_id = body.view.id;
	})
	
	app.action("goMemberManageView", async ({ack, body, client}) => {
		await ack();
		const seekerId = await getSeekerId(body, null, client);
		await client.views.update({
			view_id: body.view.id,
			hash: body.view.hash,
			view: await memberManageHomeView(seekerId)
		})
	});

    app.action("goManualView", async ({ ack, body, client, logger }) => {
        try {
            await ack();
			
            await client.views.update({
                view_id: body.view.id,
                hash: body.view.hash,
                view: await manualHomeView(),
            });
        } catch (error) {
            logger.error(error);
        }
    });

};
