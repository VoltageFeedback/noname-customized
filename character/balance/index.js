// 'use strict';
import { b_sunhao } from './b_sunhao.js';
import { b_huangyueying } from './b_huangyueying.js';


const characterObjArray = [
	b_sunhao, 
	b_huangyueying,
];

const characterPackageData = {
	name: 'balance/index',
	connect: true,
	character: {},
	characterIntro: {},
	characterReplace: {},
	skill: {},
	translate: {
		"balance/index": '平衡',
		"balance": '平衡',
	},
};

characterObjArray.forEach(characterObj => {
	characterPackageData.character = { ...characterPackageData.character, ...characterObj.character };
	characterPackageData.characterIntro = { ...characterPackageData.characterIntro, ...characterObj.characterIntro };
	characterPackageData.characterReplace = { ...characterPackageData.characterReplace, ...characterObj.characterReplace };
	characterPackageData.skill = { ...characterPackageData.skill, ...characterObj.skill };
	characterPackageData.translate = { ...characterPackageData.translate, ...characterObj.translate };
});

game.import('character', function (lib, game, ui, get, ai, _status) {
	return characterPackageData;
});

// game.import('dummy', function (lib, game, ui, get, ai, _status) {
// 	lib.init.js(lib.assetURL + 'character', 'balance/b_sunhao')
// 	return {}
// });

export { };
