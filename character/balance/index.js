// 'use strict';
import {b_sunhao} from './b_sunhao.js';


game.import('character', function (lib, game, ui, get, ai, _status) {
	return {
		name: 'balance/index',
		connect: true,
		character: {...b_sunhao.character},
		characterIntro: {...b_sunhao.characterIntro},
		characterReplace: {...b_sunhao.characterReplace},
		skill: {...b_sunhao.skill},
		translate: {
			"balance/index": '平衡',
			...b_sunhao.translate,
		},
	};
});

// game.import('dummy', function (lib, game, ui, get, ai, _status) {
// 	lib.init.js(lib.assetURL + 'character', 'balance/b_sunhao')
// 	return {}
// });

export {};
