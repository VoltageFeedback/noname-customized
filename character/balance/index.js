'use strict';
// import {b_sunhao} from './b_sunhao.js';
// const b_sunhao = require('./b_sunhao.js');

// game.import('character', function (lib, game, ui, get, ai, _status) {
// 	return {
// 		name: 'balance/index',
// 		connect: true,
// 		characterSort: {
// 			sp: {
// 				sp_tianji: ["b_sunhao"],
// 			},
// 		},
// 		character: {
// 			b_sunhao: ['male', 'wu', 5, ['b_recanshi', 'rechouhai', 'b_guiming'], ['zhu']],

// 		},
// 		characterIntro: {
// 			b_sunhao: '孙权之孙，孙和之子，东吴的末代君主。在位初期虽施行过明政，但不久即沉溺酒色，专于杀戮，变得昏庸暴虐，嗜用挖眼、剥皮等酷刑。280年，吴国被西晋所灭，孙皓投降西晋，被封为归命侯。',

// 		},
// 		characterReplace: {
// 			b_sunhao: ['b_sunhao', 'sunhao'],
// 		},
// 		skill: {
// 			b_recanshi: {
// 				audio: 'canshi',
// 				trigger: { player: 'phaseDrawBegin2' },
// 				check: function (event, player) {
// 					const handcardTrickCount = player.countCards('h', function (card) {
// 						return get.type(card, 'trick') == 'trick' && player.hasUseTarget(card);
// 					});
// 					// Always trigger if player skips phaseUse or has no usable trick cards in hand
// 					if (player.skipList.contains('phaseUse') || !handcardTrickCount) return true;
// 					// To check if player can avoid no handcards at end
// 					const currentHandcardCount = player.countCards('h');
// 					const drawCardCount = player.draw.num;
// 					let extraDrawCardCount = game.countPlayer(function (current) {
// 						if (player.hasZhuSkill('b_guiming') && current.group == 'wu' && current != player) return true;
// 						return current.isDamaged() && current != player;
// 					}) + 1;
// 					let minGlobalHandcardCount = 0;
// 					game.filterPlayer(function (target) {
// 						if (target.isMinHandcard()) {
// 							minGlobalHandcardCount = target.countCards('h');
// 							return player != target;
// 						}
// 						return false;
// 					});
// 					if (currentHandcardCount == minGlobalHandcardCount+1) return true;
// 					if ((currentHandcardCount+drawCardCount+extraDrawCardCount) - (2*handcardTrickCount-minGlobalHandcardCount-1) > 0) {
// 						return true;
// 					};
// 					return false;
// 				},
// 				prompt: function (event, player) {
// 					var num = game.countPlayer(function (current) {
// 						if (player.hasZhuSkill('b_guiming') && current.group == 'wu' && current != player) return true;
// 						return current.isDamaged() && current != player;
// 					});
// 					return '残蚀：是否多摸' + get.cnNumber(num + 1) + '张牌？';
// 				},
// 				prompt2: function (event, player) {
// 					if (player.hasZhuSkill('b_guiming')) {
// 						return '摸牌阶段开始时，你可以多摸X+1张牌（X为其他已受伤角色或其他吴势力角色），若如此做，当你于此回合内使用【杀】或普通锦囊牌时，若你手牌数不为全场最少之一，你弃置一张牌。';
// 					}
// 					return lib.translate['b_recanshi_info'];
// 				},
// 				content: function () {
// 					var num = game.countPlayer(function (current) {
// 						if (player.hasZhuSkill('b_guiming') && current.group == 'wu' && current != player) return true;
// 						return current.isDamaged() && current != player;
// 					});
// 					trigger.num += num + 1;
// 					player.addTempSkill('b_recanshi2');
// 				}
// 			},
// 			b_recanshi2: {
// 				trigger: { player: 'useCard' },
// 				forced: true,
// 				filter: function (event, player) {
// 					if (player.countCards('he') == 0) return false;
// 					if (event.card.name == 'sha') return true;
// 					return get.type(event.card) == 'trick';
// 				},
// 				autodelay: true,
// 				content: function () {
// 					if (!player.isMinHandcard()) player.chooseToDiscard(true, 'he');
// 				}
// 			},
// 			// rechouhai: {
// 			// 	audio: 'chouhai',
// 			// 	trigger: { player: 'damageBegin3' },
// 			// 	forced: true,
// 			// 	check: function () {
// 			// 		return false;
// 			// 	},
// 			// 	filter: function (event, player) {
// 			// 		return event.card && event.card.name == 'sha' && player.countCards('h') == 0;
// 			// 	},
// 			// 	content: function () {
// 			// 		trigger.num++;
// 			// 	},
// 			// 	ai: {
// 			// 		effect: {
// 			// 			target: function (card, player, target, current) {
// 			// 				if (card.name == 'sha' && target.countCards('h') == 0) return [1, -2];
// 			// 			}
// 			// 		}
// 			// 	}
// 			// },
// 			b_guiming: {
// 				unique: true,
// 				zhuSkill: true,
// 			},
// 		},
// 		translate: {
// 			"balance/index": '平衡',
// 			b_sunhao: '衡孙皓',
// 			b_recanshi: '残蚀',
// 			b_recanshi2: '残蚀',
// 			b_recanshi_info: '摸牌阶段开始时，你可以多摸X+1张牌（X为其他已受伤角色数），若如此做，当你于此回合内使用【杀】或普通锦囊牌时，若你手牌数不为全场最少之一，你弃置一张牌。',
// 			// rechouhai: '仇海',
// 			// rechouhai_info: '锁定技，当你受到渠道为【杀】的伤害时，若你没有手牌，此伤害+1。',
// 			b_guiming: '归命',
// 			b_guiming_info: '主公技，锁定技，你将残蚀描述中的“其他已受伤角色”改为“其他已受伤角色或其他吴势力角色”',

// 		},
// 	};
// });

game.import('dummy', function (lib, game, ui, get, ai, _status) {
	lib.init.js(lib.assetURL + 'character', 'balance/b_sunhao')
	return {}
});

