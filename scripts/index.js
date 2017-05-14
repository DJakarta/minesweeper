var game={
	height: 24,
	width: 30,
	mines: 100,
	cells: [],
	nums: [],
	bbbvm: [],
	bbbv: 0,
	clicks: 0,
	won: 0,
	lost: 0,
	ended: 0,
	cheats: 0,
	initVars: function () {
		window.i=0;
		window.j=0;
		game.cellDiv=document.getElementById("cellDiv");
		game.board=document.getElementById("game");
		game.resetButton=document.getElementById("reset");
	},
	addMines: function () {
		var minesToGo=game.mines;
		for (i=0; i<game.height; i++) {
			game.cells.push([]);
			for (j=0; j<game.width; j++) {
				game.cells[i].push(0);
			}
		}
		while (minesToGo) {
			randI=Math.round(Math.random()*10000)%game.height;
			randJ=Math.round(Math.random()*10000)%game.width;
			while (game.cells[randI][randJ]) {
				randI=Math.round(Math.random()*10000)%game.height;
				randJ=Math.round(Math.random()*10000)%game.width;
			}
			game.cells[randI][randJ]=1;
			minesToGo--;
		}
	},
	makeTable: function () {
		for (i=0; i<game.height; i++) {
			newRow=document.createElement("div");
			newRow.className="tr";
			for (j=0; j<game.width; j++) {
				newCell=document.createElement("div");
				newCell.className="td";
				newCell.id=i.leadingZeroes(3)+"x"+j.leadingZeroes(3);
				newCell.dataset.func="cell";
				newRow.appendChild(newCell);
			}
			game.cellDiv.appendChild(newRow);
		}
	},
	buildNums: function () {
		for (i=0; i<game.height; i++) {
			game.nums.push([]);
			for (j=0; j<game.width; j++) {
				game.nums[i].push(game.neighbourMines(i, j));
			}
		}
	},
	getTableCell: function (i, j) {
		return document.getElementById(i.leadingZeroes(3)+"x"+j.leadingZeroes(3));
	},
	showCell: function (i, j) {
		game.cells[i][j]=2;
		if (game.nums[i][j]) {
			bgImage="url('imgs/bg/"+game.nums[i][j]+".png')";
		}
		else {
			bgImage="url('imgs/bg/empty.png')";
		}
		game.getTableCell(i, j).style.backgroundImage=bgImage;
	},
	checkForWin: function () {
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				if (game.cells[i][j]==0 || game.cells[i][j]==3) {
					return 0;
				}
			}
		}
		return 1;
	},
	revealCells: function (i, j) {
		if (game.cells[i][j]==0) {
			game.showCell(i, j);
			currCell=game.getTableCell(i, j);
			if (game.nums[i][j]==0) {
				if (i==0 && j==0) {
					game.revealCells(i, j+1);
					game.revealCells(i+1, j);
					game.revealCells(i+1, j+1);
				}
				else if (i==0 && j==game.width-1) {
					game.revealCells(i, j-1);
					game.revealCells(i+1, j-1);
					game.revealCells(i+1, j);
				}
				else if (i==game.height-1 && j==0) {
					game.revealCells(i-1, j);
					game.revealCells(i-1, j+1);
					game.revealCells(i, j+1);
				}
				else if (i==game.height-1 && j==game.width-1) {
					game.revealCells(i-1, j-1);
					game.revealCells(i-1, j);
					game.revealCells(i, j-1);
				}
				else if (i==0) {
					game.revealCells(i, j-1);
					game.revealCells(i, j+1);
					game.revealCells(i+1, j-1);
					game.revealCells(i+1, j);
					game.revealCells(i+1, j+1);
				}
				else if (i==game.height-1) {
					game.revealCells(i-1, j-1);
					game.revealCells(i-1, j);
					game.revealCells(i-1, j+1);
					game.revealCells(i, j-1);
					game.revealCells(i, j+1);
				}
				else if (j==0) {
					game.revealCells(i-1, j);
					game.revealCells(i-1, j+1);
					game.revealCells(i, j+1);
					game.revealCells(i+1, j);
					game.revealCells(i+1, j+1);
				}
				else if (j==game.width-1) {
					game.revealCells(i-1, j-1);
					game.revealCells(i-1, j);
					game.revealCells(i, j-1);
					game.revealCells(i+1, j-1);
					game.revealCells(i+1, j);
				}
				else {
					game.revealCells(i-1, j-1);
					game.revealCells(i-1, j);
					game.revealCells(i-1, j+1);
					game.revealCells(i, j-1);
					game.revealCells(i, j+1);
					game.revealCells(i+1, j-1);
					game.revealCells(i+1, j);
					game.revealCells(i+1, j+1);
				}
			}
		}
	},
	revealAllCells: function () {
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				if (game.cells[i][j]==0) {
					game.cells[i][j]=2;
					currCell=game.getTableCell(i, j);
					currCell.dataset.state="1";
					currCell.innerText=game.nums[i][j] ? game.nums[i][j] : '';
				}
			}
		}
	},
	flagCell: function (currCell) {
		i=parseInt(currCell.id.slice(0,3),10);
		j=parseInt(currCell.id.slice(4,7),10);
		if (game.cells[i][j]==0 || game.cells[i][j]==1) {
			game.cells[i][j]+=3;
			currCell.style.backgroundImage="url('imgs/bg/flag.png')";
		}
		else if (game.cells[i][j]==3 || game.cells[i][j]==4) {
			game.cells[i][j]-=3;
			currCell.style.backgroundImage="url('imgs/bg/unpressed.png')";
		}
	},
	neighbourMines: function (i, j) {
		var num=0;
		if (i==0 && j==0) {
			if (game.cells[i][j+1]==1 || game.cells[i][j+1]==4) {
				num++;
			}
			if (game.cells[i+1][j]==1 || game.cells[i+1][j]==4) {
				num++;
			}
			if (game.cells[i+1][j+1]==1 || game.cells[i+1][j+1]==4) {
				num++;
			}
		}
		else if (i==0 && j==game.width-1) {
			if (game.cells[i][j-1]==1 || game.cells[i][j-1]==4) {
				num++;
			}
			if (game.cells[i+1][j-1]==1 || game.cells[i+1][j-1]==4) {
				num++;
			}
			if (game.cells[i+1][j]==1 || game.cells[i+1][j]==4) {
				num++;
			}
		}
		else if (i==game.height-1 && j==0) {
			if (game.cells[i-1][j]==1 || game.cells[i-1][j]==4) {
				num++;
			}
			if (game.cells[i-1][j+1]==1 || game.cells[i-1][j+1]==4) {
				num++;
			}
			if (game.cells[i][j+1]==1 || game.cells[i][j+1]==4) {
				num++;
			}
		}
		else if (i==game.height-1 && j==game.width-1) {
			if (game.cells[i-1][j-1]==1 || game.cells[i-1][j-1]==4) {
				num++;
			}
			if (game.cells[i-1][j]==1 || game.cells[i-1][j]==4) {
				num++;
			}
			if (game.cells[i][j-1]==1 || game.cells[i][j-1]==4) {
				num++;
			}
		}
		else if (i==0) {
			if (game.cells[i][j-1]==1 || game.cells[i][j-1]==4) {
				num++;
			}
			if (game.cells[i][j+1]==1 || game.cells[i][j+1]==4) {
				num++;
			}
			if (game.cells[i+1][j-1]==1 || game.cells[i+1][j-1]==4) {
				num++;
			}
			if (game.cells[i+1][j]==1 || game.cells[i+1][j]==4) {
				num++;
			}
			if (game.cells[i+1][j+1]==1 || game.cells[i+1][j+1]==4) {
				num++;
			}
		}
		else if (i==game.height-1) {
			if (game.cells[i-1][j-1]==1 || game.cells[i-1][j-1]==4) {
				num++;
			}
			if (game.cells[i-1][j]==1 || game.cells[i-1][j]==4) {
				num++;
			}
			if (game.cells[i-1][j+1]==1 || game.cells[i-1][j+1]==4) {
				num++;
			}
			if (game.cells[i][j-1]==1 || game.cells[i][j-1]==4) {
				num++;
			}
			if (game.cells[i][j+1]==1 || game.cells[i][j+1]==4) {
				num++;
			}
		}
		else if (j==0) {
			if (game.cells[i-1][j]==1 || game.cells[i-1][j]==4) {
				num++;
			}
			if (game.cells[i-1][j+1]==1 || game.cells[i-1][j+1]==4) {
				num++;
			}
			if (game.cells[i][j+1]==1 || game.cells[i][j+1]==4) {
				num++;
			}
			if (game.cells[i+1][j]==1 || game.cells[i+1][j]==4) {
				num++;
			}
			if (game.cells[i+1][j+1]==1 || game.cells[i+1][j+1]==4) {
				num++;
			}
		}
		else if (i==game.width-1) {
			if (game.cells[i-1][j-1]==1 || game.cells[i-1][j-1]==4) {
				num++;
			}
			if (game.cells[i-1][j]==1 || game.cells[i-1][j]==4) {
				num++;
			}
			if (game.cells[i][j-1]==1 || game.cells[i][j-1]==4) {
				num++;
			}
			if (game.cells[i+1][j-1]==1 || game.cells[i+1][j-1]==4) {
				num++;
			}
			if (game.cells[i+1][j]==1 || game.cells[i+1][j]==4) {
				num++;
			}
		}
		else {
			if (game.cells[i-1][j-1]==1 || game.cells[i-1][j-1]==4) {
				num++;
			}
			if (game.cells[i-1][j]==1 || game.cells[i-1][j]==4) {
				num++;
			}
			if (game.cells[i-1][j+1]==1 || game.cells[i-1][j+1]==4) {
				num++;
			}
			if (game.cells[i][j-1]==1 || game.cells[i][j-1]==4) {
				num++;
			}
			if (game.cells[i][j+1]==1 || game.cells[i][j+1]==4) {
				num++;
			}
			if (game.cells[i+1][j-1]==1 || game.cells[i+1][j-1]==4) {
				num++;
			}
			if (game.cells[i+1][j]==1 || game.cells[i+1][j]==4) {
				num++;
			}
			if (game.cells[i+1][j+1]==1 || game.cells[i+1][j+1]==4) {
				num++;
			}
		}
		return num;
	},
	markCell: function (i, j) {
		if (game.bbbvm[i][j]==0) {
			game.bbbvm[i][j]=1;
			if (game.nums[i][j]==0) {
				if (i==0 && j==0) {
					game.markCell(i, j+1);
					game.markCell(i+1, j);
					game.markCell(i+1, j+1);
				}
				else if (i==0 && j==game.width-1) {
					game.markCell(i, j-1);
					game.markCell(i+1, j-1);
					game.markCell(i+1, j);
				}
				else if (i==game.height-1 && j==0) {
					game.markCell(i-1, j);
					game.markCell(i-1, j+1);
					game.markCell(i, j+1);
				}
				else if (i==game.height-1 && j==game.width-1) {
					game.markCell(i-1, j-1);
					game.markCell(i-1, j);
					game.markCell(i, j-1);
				}
				else if (i==0) {
					game.markCell(i, j-1);
					game.markCell(i, j+1);
					game.markCell(i+1, j-1);
					game.markCell(i+1, j);
					game.markCell(i+1, j+1);
				}
				else if (i==game.height-1) {
					game.markCell(i-1, j-1);
					game.markCell(i-1, j);
					game.markCell(i-1, j+1);
					game.markCell(i, j-1);
					game.markCell(i, j+1);
				}
				else if (j==0) {
					game.markCell(i-1, j);
					game.markCell(i-1, j+1);
					game.markCell(i, j+1);
					game.markCell(i+1, j);
					game.markCell(i+1, j+1);
				}
				else if (j==game.width-1) {
					game.markCell(i-1, j-1);
					game.markCell(i-1, j);
					game.markCell(i, j-1);
					game.markCell(i+1, j-1);
					game.markCell(i+1, j);
				}
				else {
					game.markCell(i-1, j-1);
					game.markCell(i-1, j);
					game.markCell(i-1, j+1);
					game.markCell(i, j-1);
					game.markCell(i, j+1);
					game.markCell(i+1, j-1);
					game.markCell(i+1, j);
					game.markCell(i+1, j+1);
				}
			}
		}
	},
	measureBoardBbbv: function () {
		for (i=0; i<game.height; i++) {
			game.bbbvm.push([]);
			for (j=0; j<game.width; j++) {
				game.bbbvm[i].push(game.cells[i][j]);
			}
		}
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				if (game.nums[i][j]==0 && game.bbbvm[i][j]==0) {
					game.markCell(i, j);
					game.bbbv++;
				}
			}
		}
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				if (game.bbbvm[i][j]==0) {
					game.bbbvm[i][j]=1;
					game.bbbv++;
				}
			}
		}
	},
	pressCell: function (i, j) {
		
	},
	releaseCell: function (i, j) {
		
	},
	mouseRespond: function (ev) {
		if (ev.type=="mousedown") {
			if (ev.button==0) {
				if (ev.target.dataset.func=="cell" && !game.ended) {
					game.clickedCell=1;
					i=parseInt(ev.target.id.slice(0,3),10);
					j=parseInt(ev.target.id.slice(4,7),10);
					if (game.cells[i][j]==1 || game.cells[i][j]==0) {
						ev.target.style.backgroundImage="url('imgs/bg/empty.png')";
					}
				}
				else if (ev.target==game.board && !game.ended) {
					game.clickedCell=1;
				}
			}
			else if (ev.button==2) {
				if (ev.target.dataset.func=="cell" && !game.ended) {
					game.flagCell(ev.target);
				}
			}
		}
		else if (ev.type=="mouseup") {
			if (ev.button==0) {
				game.clickedCell=0;
				if (ev.target.dataset.func=="cell" && !game.ended) {
					i=parseInt(ev.target.id.slice(0,3),10);
					j=parseInt(ev.target.id.slice(4,7),10);
					if (game.cells[i][j]==1) {
						game.cells[i][j]=5;
						ev.target.style.backgroundImage="url('imgs/bg/hitmine.png')";
						game.clicks++;
						game.lose();
					}
					else if (game.cells[i][j]==0) {
						game.clicks++;
						game.revealCells(i, j);
						if (game.checkForWin()) {
							game.win();
						}
					}
				}
			}
		}
		else if (ev.type=="mouseover") {
			if (ev.button==0) {
				if (ev.target.dataset.func=="cell") {
					if (game.clickedCell) {
						i=parseInt(ev.target.id.slice(0,3),10);
						j=parseInt(ev.target.id.slice(4,7),10);
						if (game.cells[i][j]==1 || game.cells[i][j]==0) {
							ev.target.style.backgroundImage="url('imgs/bg/empty.png')";
						}
					}
				}
			}
		}
		else if (ev.type=="mouseout") {
			if (ev.button==0) {
				if (ev.target.dataset.func=="cell") {
					if (game.clickedCell) {
						i=parseInt(ev.target.id.slice(0,3),10);
						j=parseInt(ev.target.id.slice(4,7),10);
						if (game.cells[i][j]==1 || game.cells[i][j]==0) {
							ev.target.style.backgroundImage="url('imgs/bg/unpressed.png')";
						}
					}
				}
			}
		}
		else if (ev.type=="dblclick") {
			game.gModeToggle();
		}
	},
	preventMenu: function (ev) {
		ev.preventDefault();
	},
	clickCell: function (ev) {
		if (ev.type=="mousedown") {
			game.pressedCell=1;
		}
	},
	addClickHandler: function () {
		game.board.addEventListener("contextmenu", game.preventMenu, false);
		document.addEventListener("mouseup", game.mouseRespond, false);
		document.addEventListener("mousedown", game.mouseRespond, false);
		document.addEventListener("mouseover", game.mouseRespond, false);
		document.addEventListener("mouseout", game.mouseRespond, false);
		game.board.addEventListener("dblclick", game.mouseRespond, false);
	},
	win: function () {
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				currCell=game.getTableCell(i, j);
				if (game.cells[i][j]==1) {
					game.flagCell(currCell);
				}
			}
		}
		if (game.cheats) {
			game.gModeRemove();
		}
		game.resetButton.style.backgroundImage="url('imgs/bg/won.png')";
		game.won=1;
		game.ended=1;
	},
	lose: function () {
		game.resetButton.style.backgroundImage="url('imgs/bg/dead.png')";
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				currCell=game.getTableCell(i, j);
				if (game.cells[i][j]==1) {
					currCell.style.backgroundImage="url('imgs/bg/mine.png')";
				}
				else if (game.cells[i][j]==3) {
					currCell.style.backgroundImage="url('imgs/bg/nomine.png')";
				}
			}
		}
		if (game.cheats) {
			game.gModeRemove();
		}
		game.lost=1;
		game.ended=1;
	},
	restart: function () {
		game.lost=0;
		game.won=0;
		game.ended=0;
		location.reload();		
	},
	peekInCell: function (ev) {
		i=parseInt(this.id.slice(0,3),10);
		j=parseInt(this.id.slice(4,7),10);
		if (ev.type=="mouseover") {
			if (game.cells[i][j]==1 || game.cells[i][j]==4) {
				game.resetButton.style.backgroundImage="url('imgs/bg/cheat.png')";
			}
		}
		else if (ev.type=="mouseout") {
			game.resetButton.style.backgroundImage="url('imgs/bg/normal.png')";
		}
	},
	gModeAdd: function () {
		game.cheats=1;
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				currCell=game.getTableCell(i, j);
				currCell.addEventListener("mouseover", game.peekInCell, false);
				currCell.addEventListener("mouseout", game.peekInCell, false);
			}
		}
	},
	gModeRemove: function () {
		game.cheats=0;
		for (i=0; i<game.height; i++) {
			for (j=0; j<game.width; j++) {
				currCell=game.getTableCell(i, j);
				currCell.removeEventListener("mouseover", game.peekInCell, false);
				currCell.removeEventListener("mouseout", game.peekInCell, false);
			}
		}
	},
	gModeToggle: function () {
		if (!game.ended) {
			if (game.cheats) {
				game.gModeRemove();
			}
			else {
				game.gModeAdd();
			}
		}
	},
	init: function () {
		game.initVars();
		game.addMines();
		game.buildNums();
		game.measureBoardBbbv();
		game.makeTable();		
		game.addClickHandler();
	},
};

document.onload=game.init();