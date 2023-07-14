'use strict';
import { game } from '/game/game.js';
import { lib } from '/game/game.js';
import { ui } from '/game/game.js';
import { get } from '/game/game.js';
import { ai } from '/game/game.js';
import { _status } from '/game/game.js';


const b_gongsunzan = {
	character: {
		b_gongsunzan: ['male', 'qun', 4, ['b_yicong', 'dcqiaomeng']],

	},
	characterIntro: {},
	characterReplace: {
		b_gongsunzan: ['b_gongsunzan', 'xin_gongsunzan', 'sp_gongsunzan', 're_gongsunzan', 'dc_gongsunzan'],
	},
	skill: {
		b_yicong: {
      trigger: {
        player: ["changeHp"],
      },
      audio: 2,
      audioname: { gongsunzan: 'yicong' },
      forced: true,
      filter: function (event, player) {
        return get.sgn(player.hp - 2.5) != get.sgn(player.hp - 2.5 - event.num);
      },
      content: function () { },
      mod: {
        globalFrom: function (from, to, current) {
          return current - 1;
        },
        globalTo: function (from, to, current) {
          if (to.hp <= 2) return current + 1;
        },
      },
      group: ['b_yicong_draw'],
      subSkill: {
        draw: {
          // audio: 2,
          trigger: { global: ['loseAfter', 'loseAsyncAfter'] },
          filter: function (event, player) {
            if (event.type != 'discard' || event.getlx === false) return false;
            if (get.distance(player, event.player) > 1) return false;
            if (player.hasSkill('b_yicong_mark')) return false;
            let cards = event.cards.slice(0);
            let evt = event.getl(player);
            if (evt && evt.cards) cards.removeArray(evt.cards);
            for (let i = 0; i < cards.length; i++) {
              if (get.type(cards[i], null, event.hs && event.hs.contains(cards[i]) ? event.player : false) == 'basic' && cards[i].original != 'j') {
                return true;
              }
            }
            return false;
          },
          forced: true,
          content: function () {
            "step 0"
            if (trigger.delay == false) game.delay();
            "step 1"
            let card = get.cardPile2(function (card) {
              return card.name == 'sha';
            });
            if (!card) {
              card = get.discardPile(function (card) {
                return card.name == 'sha';
              });
            }
            if (card) {
              player.showCards([card]);
              player.gain(card, 'gain2', 'log');
            }
            if (event.name == 'b_yicong_draw') player.addTempSkill('b_yicong_mark');
          },
        },
        mark: { 
          charlotte: true
        },
      },
      ai: {
        threaten: 0.82
      }
    },
	},
	translate: {
		b_gongsunzan: '衡公孙瓒',
		b_yicong: '义从',
		b_yicong_info: '锁定技，你计算与其他角色的距离时-1。若你的体力值不大于2，则其他角色计算与你的距离时+1。\
    每名角色的回合限一次，你距离为1的角色弃置基本牌时，你随机展示并获得一张【杀】。',
	},
};

export { b_gongsunzan };



