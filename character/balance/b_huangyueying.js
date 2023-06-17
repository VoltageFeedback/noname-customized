'use strict';
import { game } from '/game/game.js';
import { lib } from '/game/game.js';
import { ui } from '/game/game.js';
import { get } from '/game/game.js';
import { ai } from '/game/game.js';
import { _status } from '/game/game.js';


const b_huangyueying = {
  character: {
    b_huangyueying: ['female', 'shu', 3, ['b_jizhi', 'b_qicai']],

  },
  characterIntro: {},
  characterReplace: {
    b_huangyueying: ['rehuangyueying', 'huangyueying'],
  },
  skill: {
    b_jizhi: {
      audio: 'rejizhi',
      group: 'b_jizhi2',
      trigger: { player: ['phaseUseBegin', 'phaseUseEnd'] },
      frequent: false,
      check: function (event, player) {
        return player.countCards('h', { type: 'trick' }) == 0 && player.countCards('h', { type: 'delay' }) == 0;
      },
      prompt2: function (event, player) {
        let promptContent = '你可以展示手牌：';
        if (player.countCards('h', { type: 'trick' }) == 0 && player.countCards('h', { type: 'delay' }) == 0) {
          promptContent += '当前其中没有锦囊牌，你将获得牌堆或弃牌堆中随机一张锦囊牌并展示。'
        } else {
          promptContent += '当前其中有锦囊牌，你无法因此摸牌。'
        }
        return promptContent;
      },
      content: function () {
        player.showHandcards(get.translation(player) + '发动了【集智】');
        if (player.countCards('h', { type: 'trick' }) == 0 && player.countCards('h', { type: 'delay' }) == 0) {
          let card = get.cardPile2(function (card) {
            return get.type(card) == 'trick' || get.type(card) == 'delay';
          });
          if (!card) {
            card = get.discardPile(function (card) {
              return get.type(card) == 'trick' || get.type(card) == 'delay';
            });
          }
          if (card) {
            player.showCards([card]);
            player.gain(card, 'gain2', 'log');
          }
        }
      }
    },
    b_jizhi2: {
      audio: 'jizhi',
      trigger: { player: 'useCard' },
      frequent: true,
      preHidden: true,
      filter: function (event) {
        return ((get.type(event.card) == 'trick' || get.type(event.card) == 'delay') && event.card.isCard);
      },
      content: function () {
        player.draw();
      },
      ai: {
        threaten: 1.4,
        noautowuxie: true,
      }
    },
    b_qicai: {
      mod: {
        targetInRange: function (card, player, target, now) {
          var type = get.type(card);
          if (type == 'trick' || type == 'delay') return true;
        },
        canBeDiscarded: function (card) {
          if (get.position(card) == 'e' && ['equip2', 'equip5'].contains(get.subtype(card))) return false;
        },
        maxHandcard: function (player, num) {
          const equip2Equip5Count = player.countCards('e', function(card) {
            if (get.subtype(card) == 'equip2' || get.subtype(card) == 'equip5') return true;
            return false;
          })
          return num + equip2Equip5Count;
        }
      },
    },
  },
  translate: {
    b_huangyueying: '衡黄月英',
    b_jizhi: '集智',
    b_jizhi_info: '①出牌阶段开始时，或出牌阶段结束时，你可以展示手牌：若没有锦囊牌，你获得牌堆或弃牌堆中随机一张锦囊牌并展示。②当你使用锦囊牌时，你可以摸一张牌。',
    b_jizhi_faq: '【集智】检索顺序',
    b_jizhi_faq_info: '【集智】随机检索锦囊牌时，若牌堆中没有锦囊牌，才会从弃牌堆中获得。',
    b_qicai: '奇才',
    b_qicai_info: '锁定技，你使用锦囊牌无距离限制。你装备区内的防具牌与宝物牌不能被其他角色弃置。你的手牌上限+X（X为你装备区内的防具牌与宝物牌之和）。',
  }
};

export { b_huangyueying };