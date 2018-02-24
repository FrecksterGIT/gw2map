import TemplateElement from './template-element';
import template from './templates/notifications.tpl';
import {getGuild} from '../data/guilds';
import {getObjectiveName, getMapNames, getWorldNameForColor} from '../data/objectives';
import timetools from '../utils/timetools';
import I18N from '../utils/i18n';
import {sprintf} from 'sprintf-js';
import DefineList from 'can-define/list/list';
import DefineMap from 'can-define/map/map';

export default class Notifications extends TemplateElement {
	initViewModel() {
		this.Notification = DefineMap.extend({
			timestamp: {
				type: 'number',
				get: () => {
					return this.timestamp;
				},
				set: value => {
					this.timestamp = value;
				}
			},
			date: {
				type: 'string',
				get: () => {
					return this.date;
				},
				set: value => {
					this.date = value;
				}
			},
			message: {
				type: 'string',
				get: () => {
					return this.message;
				},
				set: value => {
					this.message = value;
				}
			},
			type: {
				type: 'string',
				get: () => {
					return this.type;
				},
				set: value => {
					this.type = value;
				}
			}
		});
		this.viewModel = new DefineList([]);
		return Promise.resolve(this.viewModel);
	}

	getTemplate() {
		return template;
	}

	templateRendered() {
		let newNotificationHandler = this.handleNewNotification.bind(this);
		window.addEventListener('gw2notification', newNotificationHandler);
	}

	addNewOwnerNotification(change, objective) {
		if (objective.type === 'Ruins' || objective.type === 'Mercenary') {
			return;
		}
		getObjectiveName(objective)
			.then(objectiveName => {
				return getMapNames(objective.match_worlds).then(mapNames => {
					return getWorldNameForColor(objective.owner).then(worldName => {
						// objectiveId, objectiveOldOwnerClass, objectiveName, mapClass, mapName, objectiveOwnerClass, objectiveOwnerName
						let message = sprintf(
							I18N.t('gw2:turnedString'),
							objective.id,
							change.lhs ? change.lhs : objective.owner, // old owner color
							objectiveName,
							objective.map_type, // color for map
							mapNames[objective.map_type], // map name
							objective.owner, // owner class
							worldName // owner name
						);
						this.addNewNotification(message, objective.last_flipped, 'flipped');
					});
				});
			})
			.catch(err => {
				console.log(err);
			});
	}

	addNewClaimNotification(change, objective) {
		if (!change.rhs) {
			return;
		}
		getGuild(change.rhs).then(guild => {
			getObjectiveName(objective)
				.then(objectiveName => {
					// objectiveId, objectiveOwnerClass, objectiveName, guildTag, guildName
					let message = sprintf(I18N.t('gw2:claimedString'), objective.id, objective.owner, objectiveName, guild.tag, guild.name);
					this.addNewNotification(message, objective.claimed_at, 'claimed');
				})
				.catch(err => {
					console.log(err);
				});
		});
	}

	addNewNotification(notification, date, type) {
		const notificationVM = new this.Notification({
			timestamp: Date.parse(date),
			date: timetools.toTime(date),
			message: notification,
			type: type
		});
		this.viewModel.unshift(notificationVM);
	}

	clearNotifications() {
		this.viewModel.replace([]);
	}

	handleNewNotification(changedDataEvent) {
		switch (changedDataEvent.data.type) {
			case 'owner': {
				this.addNewOwnerNotification(changedDataEvent.data.change, changedDataEvent.data.changedData);
				break;
			}
			case 'claim': {
				this.addNewClaimNotification(changedDataEvent.data.change, changedDataEvent.data.changedData);
				break;
			}
			default: {
				// do nothing
			}
		}
	}
}

window.customElements.define('gw2-notifications', Notifications);
