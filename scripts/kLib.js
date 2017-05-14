/*
Comments here
*/

kLib={
	basicInfo: {
		version: '1.0',
		build: '06',
		stage: 'onWork',
		buildDate: '2012-05-16',
		getFullVersionInfo: function () {
			return kLib.basicInfo.version+'.'+kLib.basicInfo.build+' '+kLib.basicInfo.stage;
		}
	},
	extendDefaultObjectMethods: function () {
		String.prototype.firstChar=function () {
			return this.charAt(0)
		};
		String.prototype.lastChar=function () {
			return this.charAt(this.length-1)
		};
		String.prototype.toCamelCase=function () {
			return this.replace(/((\s|-|_)+[^(\s|-|_)])/g, function ($1) {return $1.toUpperCase().replace(/(\s|-|_)+/,"")});
		};
		String.prototype.toDashCase=function () {
			return this.replace(/((\s|-|_)+[^(\s|-|_)])/g, function ($1) {return $1.replace(/(\s|-|_)+/, "-")});
		};
		String.prototype.toUnderscoreCase=function () {
			return this.replace(/((\s|-|_)+[^(\s|-|_)])/g, function ($1) {return $1.replace(/(\s|-|_)+/, "_")});
		};
		String.prototype.toJSONCase=function () {
			return this.replace(/[^(\w|$)]+/g, "").replace(/\b[0-9]+/, "");
		};
		Number.prototype.leadingZeroes=function (digits) {
			var str=this.toString();
			while (str.length<digits) {
				str="0"+str;
			}
			return str;
		}
	},
	debug: {
		writeToConsole: function (newText, overWriting) {
			consoleDisplay=document.getElementById("consoleDisplay");
			if (consoleDisplay) {
				consoleDisplay.style.visibility="visible";
				consoleDisplay.style.display="block";
				if (overWriting) {
					consoleDisplay.innerHTML=newText+'<br />';
				}
				else {
					consoleDisplay.innerHTML+=newText+'<br />';
				}
			}
			else {
				consoleDisplay=document.createElement("pre");
				consoleDisplay.id="consoleDisplay";
				consoleDisplay.style.position='fixed';
				consoleDisplay.style.bottom='0px';
				consoleDisplay.style.right='0px';
				consoleDisplay.style.width='400px';
				consoleDisplay.style.height='100px';
				consoleDisplay.style.backgroundColor='rgba(33,33,33,0.9)';
				consoleDisplay.style.color="#ffffff";
				consoleDisplay.style.zIndex="9999";
				consoleDisplay.style.overflowY="auto";
				consoleDisplay.style.wordWrap="break-word";
				consoleDisplay.style.borderRadius="5px";
				consoleDisplay.style.paddingLeft="7px";
				consoleDisplay.ondblclick="kLib.debug.closeConsole()";
				document.getElementsByTagName("body")[0].appendChild(consoleDisplay);
				kLib.debug.writeToConsole(newText, overWriting);
			}
		},
		closeConsole: function (clearConsole) {
			if (consoleDisplay) {
				consoleDisplay.style.display="none";
				if (clearConsole) {
					consoleDisplay.innerHTML="";
				}
			}
		}
	},
	createDomCache: function () {
		window.body=document.getElementsByTagName("body")[0];
		window.title=document.getElementsByTagName("title")[0];
		window.consoleDisplay=document.getElementById("consoleDisplay");		
	},
	bindFunctions: function () {
		window.cWrite=kLib.debug.writeToConsole,
		window.cClose=kLib.debug.closeConsole
	},
	directInit: function () {
		window.$k=window.kLib;
		kLib.extendDefaultObjectMethods();
		kLib.bindFunctions();
		window.onload=function () {
			kLib.onloadInit()
		};
	},
	onloadInit: function () {
		kLib.createDomCache();
	}
}
kLib.directInit();