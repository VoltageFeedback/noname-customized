'use strict';
import { game } from '/game/game.js';
import { lib } from '/game/game.js';
import { ui } from '/game/game.js';
import { get } from '/game/game.js';
import { ai } from '/game/game.js';
import { _status } from '/game/game.js';


const b_dongzhuo = {
  character: {
    b_dongzhuo: ['male', 'qun', 8, ['b_baolian', 'rejiuchi', 'b_benghuai', 'olbaonue'], ['zhu']],
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
      filterTarget: function (event, target, player) {
        return target != player;
      },
      selectTarget: -1,
      multitarget: true,
      multiline: true,
      marktext: '敛',
      intro: { name2: '敛', content: 'mark' },
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
        } else {
          event.finish();
          return;
        }
        'step 2'
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
      group: ['b_baolian_addTag', 'b_baolian_addMark'],
      subSkill: {
        addTag: {
          trigger: { player: 'changeHp', source: ['damageEnd'] },
          frequent: true,
          content: function () {
            if (trigger.name == 'changeHp' && trigger.num >= 0) return;

            if (typeof player.storage.b_baolianTagCount == 'undefined') {
              player.storage.b_baolianTagCount = 0;
            }
            player.storage.b_baolianTagCount += Math.abs(trigger.num);
            game.log('当前', '#g【暴敛】', '计数：', player.storage.b_baolianTagCount);
          },
        },
        addMark: {
          trigger: { global: 'phaseAfter' },
          frequent: true,
          content: function () {
            if (player.storage.b_baolianTagCount > 1) player.addMark('b_baolian', 1, true);
            player.storage.b_baolianTagCount = 0;
          }
        }
      }
    },
    b_benghuai: {
      audio: 'benghuai',
      audioname: ['zhugedan', 're_dongzhuo', 'ol_dongzhuo'],
      trigger: { player: 'phaseJieshuBegin' },
      forced: true,
      check: function () {
        return false;
      },
      filter: function (event, player) {
        let minMaxHp = player.maxHp;
        game.filterPlayer(function (current) {
          minMaxHp = Math.min(minMaxHp, current.maxHp);
        });
        return player.maxHp > minMaxHp && !player.hasSkill('rejiuchi_air') && !player.hasSkill('oljiuchi_air');
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
    你获得一枚“敛”。②出牌阶段限一次，你可以弃置一枚“敛”或失去一点体力上限，令所有其他角色依次进行：\
    若其没有牌，你摸一张牌；否则其需选择，弃置两张牌并对你造成1点伤害，或令你获得其一张牌。',
    b_benghuai: '崩坏',
    b_benghuai_info: '结束阶段，若你的体力上限不为全场最少之一，你须减1点体力或体力上限。',
  }

};

export { b_dongzhuo };