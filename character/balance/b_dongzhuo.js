'use strict';
import { game } from '/game/game.js';
import { lib } from '/game/game.js';
import { ui } from '/game/game.js';
import { get } from '/game/game.js';
import { ai } from '/game/game.js';
import { _status } from '/game/game.js';


const b_dongzhuo = {
  character: {
    b_dongzhuo: ['male', 'qun', '6/7', ['b_baolian', 'b_jiuchi', 'b_benghuai', 'olbaonue'], ['zhu']],
  },
  characterIntro: {},
  characterReplace: {
    b_dongzhuo: ['b_dongzhuo', 'ol_dongzhuo', 'sp_dongzhuo', 're_dongzhuo', 'dongzhuo'],
  },
  skill: {
    b_baolian: {
      audio: 'hengzheng',
      enable: 'phaseUse',
      usable: 1,
      selectTarget: -1,
      multitarget: true,
      multiline: true,
      marktext: '暴',
      intro: { name2: '暴', content: 'mark' },
      filterTarget: function (event, target, player) {
        return target != player;
      },
      check: function (event, player) {
        // 1. Player has the lowest maxHp and runs out of marks, false
        const damageCount = game.countPlayer(function (current) {
          if (get.attitude(current, player) < 0 && current.countDiscardableCards(current, 'he') >= 2) return true;
        });
        // 2. After damage, player is still healthy, true
        // 3. After damage, player is in danger but with sufficient [Peach] and [Liquor], true

        return false;
      },
      content: function () {
        'step 0'
        if (player.hasMark('b_baolian')) {
          player.chooseControl(['失去体力上限', '弃置标记']).set('ai', function () {
            return 0;
          });
        } else {
          player.loseMaxHp(true);
          event.goto(2);
        }
        'step 1'
        if (result.control == '失去体力上限') {
          player.loseMaxHp(true);
        } else if (result.control == '弃置标记') {
          player.removeMark('b_baolian', 1);
        }
        'step 2'
        if (player.isDead()) {
          event.finish();
          return;
        }
        target.line(player);
        if (event.target.countCards('he') == 0) {
          player.draw();
          event.goto(4);
        } else {
          if (event.target.countCards('he') > 1 && event.target.countDiscardableCards(event.target, 'he') >= 2) {
            event.target.chooseControl('选项一', '选项二').set('choiceList', [
              '弃置两张牌并对' + get.translation(player) + '造成1点伤害',
              '令' + get.translation(player) + '获得你一张牌。',
            ]).set('ai', function () {
              if (get.attitude(event.target, player) < 0) return 0;
              return 1;
            });
          } else {
            player.gainPlayerCard(event.target, 'he', true);
            event.goto(4);
          }
        }
        'step 3'
        if (result.control == '选项一') {
          event.target.chooseToDiscard('he', true, '请弃置两张牌', 2);
          if (event.target.ai.shown < player.ai.shown) {
            event.target.addExpose(0.1);
          }
          player.damage('nocard', event.target, 1);
        } else {
          player.gainPlayerCard(event.target, 'he', true);
        }
        'step 4'
        event.target = event.target.next;
        if (event.target != player) {
          event.goto(2);
        }
      },
      ai: {
        // threaten: 1.75,
      },
      group: ['b_baolian_addCounter', 'b_baolian_resetCounter', 'b_baolian_addMark'],
      subSkill: {
        addCounter: {
          trigger: { player: 'changeHp', source: ['damageEnd'] },
          silent: true,
          forced: true,
          content: function () {
            if (trigger.name == 'changeHp' && trigger.num >= 0) return;

            if (typeof player.storage.b_baolianCounter == 'undefined') {
              player.storage.b_baolianCounter = 0;
            }
            player.storage.b_baolianCounter += Math.abs(trigger.num);
            game.log('当前', '#g【暴敛】', '计数：', player.storage.b_baolianCounter);
          },
        },
        resetCounter: {
          trigger: { global: 'phaseAfter' },
          forced: true,
          silent: true,
          priority: 0,
          filter: function (event, player) {
            return player.storage.b_baolianCounter > 0;
          },
          content: function () {
            player.storage.b_baolianCounter = 0;
          }
        },
        addMark: {
          trigger: { global: 'phaseAfter' },
          forced: true,
          priority: 1,
          filter: function (event, player) {
            return player.storage.b_baolianCounter > 1;
          },
          content: function () {
            player.addMark('b_baolian', 1, true);
          }
        }
      }
    },

    b_jiuchi: {
      audio: 'jiuchi',
      audioname: ['re_dongzhuo'],
      enable: 'chooseToUse',
      filterCard: function (card) {
        return get.suit(card) == 'spade';
      },
      viewAs: { name: 'jiu' },
      viewAsFilter: function (player) {
        if (!player.countCards('hse', { suit: 'spade' })) return false;
        return true;
      },
      position: 'hes',
      prompt: '将一张黑桃牌当【酒】使用',
      check: function (card) {
        if (_status.event.type == 'dying') return 1 / Math.max(0.1, get.value(card));
        return 4 - get.value(card);
      },
      ai: {
        threaten: 1.6,
      },
      group: ['b_jiuchi_recover', 'b_jiuchi_loseHp'],
      subSkill: {
        recover: {
          trigger: { player: 'useCardToPlayered' },
          forced: true,
          popup: false,
          audio: 'jiuchi',
          filter: function (event, player) {
            // event: 'useCardToPlayered'
            return event.card && event.card.name == 'sha' && event.getParent().jiu &&
            event.target.hp >= player.hp;
          },
          content: function () {
            // event: 'b_jiuchi_recover'
            player.logSkill('jiuchi');
            player.recover(1);
            player.addMark('b_jiuchi_loseHp', 1, true);
          },
        },
        loseHp: {
          shaRelated: true,
          audio: 2,
          trigger: { player: 'shaMiss' },
          forced: true,
          filter: function (event, player) {
            return player.countMark('b_jiuchi_loseHp') > 0;
          },
          content: function () {
            player.removeMark('b_jiuchi_loseHp', player.countMark('b_jiuchi_loseHp'), true);
            player.loseHp();
          }
        },
      }
    },

    b_benghuai: {
      audio: 'benghuai',
      audioname: ['zhugedan', 're_dongzhuo', 'ol_dongzhuo'],
      trigger: { player: 'phaseJieshuBegin' },
      locked: true,
      forced: true,
      check: function () {
        return false;
      },
      filter: function (event, player) {
        let minMaxHp = player.maxHp;
        game.filterPlayer(function (current) {
          minMaxHp = Math.min(minMaxHp, current.maxHp);
        });
        return !player.isMinHp() && player.maxHp > minMaxHp;
        // && !player.hasSkill('rejiuchi_air') && !player.hasSkill('oljiuchi_air');
      },
      content: function () {
        "step 0"
        player.chooseControl('benghuai_hp', 'benghuai_maxHp', function (event, player) {
          if (player.hp == player.maxHp) return 'benghuai_hp';
          if (player.hp < player.maxHp - 1 || player.hp <= 2) return 'benghuai_maxHp';
          return 'benghuai_hp';
        }).set('prompt', '崩坏：失去1点体力或减1点体力上限');
        "step 1"
        if (result.control == 'benghuai_hp') {
          player.loseHp();
        }
        else {
          player.loseMaxHp(true);
        }
      },
      ai: {
        threaten: 0.5,
        neg: true,
      }
    },
  },
  translate: {
    b_dongzhuo: '衡董卓',
    b_baolian: '暴敛',
    b_baolian_info: '①一名角色的回合结束时，若你本回合内造成伤害值与减少体力值之和大于等于2时，\
    你获得一枚“暴”。②出牌阶段限一次，你可以弃置一枚“暴”或失去一点体力上限，令所有其他角色依次进行：\
    若其没有牌，你摸一张牌；否则其需选择，弃置两张牌并对你造成1点伤害，或令你获得其一张牌。',
    b_jiuchi: '酒池',
    b_jiuchi_info: '你可以将一张黑桃牌当做【酒】使用。你使用带有【酒】效果的【杀】指定\
    体力大于等于你的目标后，回复一点体力：若被【闪】抵消，你失去一点体力。',
    b_benghuai: '崩坏',
    b_benghuai_info: '结束阶段，若你的体力与体力上限都不为全场最少之一，你须减1点体力或体力上限。',
  }

};

export { b_dongzhuo };