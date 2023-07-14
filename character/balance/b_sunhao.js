'use strict';
import { game } from '/game/game.js';
import { lib } from '/game/game.js';
import { ui } from '/game/game.js';
import { get } from '/game/game.js';
import { ai } from '/game/game.js';
import { _status } from '/game/game.js';


const b_sunhao = {
	character: {
		b_sunhao: ['male', 'wu', 5, ['b_canshi', 'rechouhai', 'b_guiming'], ['zhu']],

	},
	characterIntro: {},
	characterReplace: {
		b_sunhao: ['b_sunhao', 'sunhao'],
	},
	skill: {
		b_canshi: {
			audio: 'canshi',
			trigger: { player: 'phaseDrawBegin2' },
			check: function (event, player) {
				const handcardTrickCount = player.countCards('h', function (card) {
					return get.type(card, 'trick') == 'trick' && player.hasUseTarget(card);
				});
				// Always trigger if player skips phaseUse or has no usable trick cards in hand
				if (player.skipList.contains('phaseUse') || !handcardTrickCount) return true;
				// To check if player can avoid no handcards at end
				const currentHandcardCount = player.countCards('h');
				const drawCardCount = event.num;
				let extraDrawCardCount = game.countPlayer(function (current) {
					if (player.hasZhuSkill('b_guiming') && current.group == 'wu' && current != player) return true;
					return current.isDamaged() && current != player;
				}) + 1;
				let minGlobalHandcardCount = 0;
				game.filterPlayer(function (target) {
					if (target.isMinHandcard()) {
						minGlobalHandcardCount = target.countCards('h');
						return player != target;
					}
					return false;
				});
				if (currentHandcardCount == minGlobalHandcardCount + 1) return true;
				if ((currentHandcardCount + drawCardCount + extraDrawCardCount) - (2 * handcardTrickCount - minGlobalHandcardCount - 1) > 0) {
					return true;
				};
				return false;
			},
			// Prompt title
			prompt: function (event, player) {
				var num = game.countPlayer(function (current) {
					if (player.hasZhuSkill('b_guiming') && current.group == 'wu' && current != player) return true;
					return current.isDamaged() && current != player;
				});
				return '残蚀：是否多摸' + get.cnNumber(num + 1) + '张牌？';
			},
			// Prompt content
			prompt2: function (event, player) {
				if (player.hasZhuSkill('b_guiming')) {
					return '摸牌阶段开始时，你可以多摸X+1张牌（X为其他已受伤角色或其他吴势力角色），若如此做，当你于此回合内使用【杀】或普通锦囊牌时，若你手牌数不为全场最少之一，你弃置一张牌。';
				}
				return lib.translate['b_canshi_info'];
			},
			content: function () {
				var num = game.countPlayer(function (current) {
					if (player.hasZhuSkill('b_guiming') && current.group == 'wu' && current != player) return true;
					return current.isDamaged() && current != player;
				});
				trigger.num += num + 1;
				player.addTempSkill('b_canshi2');
			}
		},
		b_canshi2: {
			trigger: { player: 'useCard' },
			forced: true,
			silent: true,
			filter: function (event, player) {
				if (player.countCards('he') == 0) return false;
				if (event.card.name == 'sha') return true;
				return get.type(event.card) == 'trick';
			},
			autodelay: true,
			content: function () {
				if (!player.isMinHandcard()) player.chooseToDiscard(true, 'he');
			}
		},
		
		b_guiming: {
			unique: true,
			zhuSkill: true,
		},
	},
	translate: {
		b_sunhao: '衡孙皓',
		b_canshi: '残蚀',
		b_canshi2: '残蚀',
		b_canshi_info: '摸牌阶段开始时，你可以多摸X+1张牌（X为其他已受伤角色数），若如此做，当你于此回合内使用【杀】或普通锦囊牌时，若你手牌数不为全场最少之一，你弃置一张牌。',
		b_guiming: '归命',
		b_guiming_info: '主公技，锁定技，你将残蚀描述中的“其他已受伤角色”改为“其他已受伤角色或其他吴势力角色”',

	},
};

export { b_sunhao };



