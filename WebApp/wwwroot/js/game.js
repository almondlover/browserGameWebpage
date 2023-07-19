//TODO: enemy types(2)
//enemyattack2 i enemydodge(?)
//run class-gotovo?pochti
//rng-bruh
//upgrade types
//ddz mn neshta
//let userdata = (localStorage.getItem("currentuser") !== null && localStorage.getItem("currentuser") !== "" )?JSON.parse(localStorage.getItem("currentuser")):null;
let token = localStorage.getItem("usertoken");
let userdata=null;

const canvas=document.querySelector("canvas");
canvas.height=720;
canvas.width=1280;
const ctx = canvas.getContext("2d");

let animreq;
const gameField=document.getElementById("gameContainer");
//startscreena
const startMenu=document.createElement("div");
//teq moje bi trq sa 1 i sashtpo
const upgradeMenu = document.createElement("div");
const uMenuTitle = document.createElement("h1");
uMenuTitle.classList.add("upgradesTitle");
upgradeMenu.classList.add("menuContainer");
upgradeMenu.classList.add("upgradeMenu");
//gameField.append(upgradeMenu);

const gameTitle=document.createElement("h1");
const startButton = document.createElement("a");
gameTitle.innerText = "Welcome back";

const finalResult = document.createElement("p");

startButton.innerText = "New Game";
finalResult.innerText = "Are you ready?";
startMenu.classList.add("menuContainer");
startMenu.classList.add("gameMenu");
gameTitle.classList.add("gameTitle");
startButton.classList.add("menuButton");
startMenu.append(gameTitle, finalResult, startButton);

const playerStatusBar = document.createElement("div");
playerStatusBar.classList.add("statusBar");
const hpDisplay = document.createElement("span");
const balanceDisplay = document.createElement("span");
const scoreDisplay = document.createElement("span");
playerStatusBar.append(hpDisplay, balanceDisplay, scoreDisplay);

const classDisplay = document.createElement("div");
classDisplay.classList.add("menuContainer");
classDisplay.classList.add("startingClassDisplay");
const classInfo = document.createElement("div");
const userBalance = document.createElement("div");
userBalance.id = "userBalance";
//classDisplay.append(classInfo, userBalance);

//imgs
const normalImg = new Image();
normalImg.src = "/imgs/assets/NormalClass.png";
const tankImg = new Image();
tankImg.src = "/imgs/assets/TankClass.png";
const gcImg = new Image();
gcImg.src = "/imgs/assets/GlassCannonClass.png";
const thiefImg = new Image();
thiefImg.src = "/imgs/assets/ThiefClass.png";

const regEnemyImg = new Image();
regEnemyImg.src = "/imgs/assets/baseEnemy.png";
const bruteEnemyImg = new Image();
bruteEnemyImg.src = "/imgs/assets/bruteEnemy.png";
const weaponNormalImg = new Image();
weaponNormalImg.src = "/imgs/assets/swordNormal.png";
const cloudAtkImg = new Image();
cloudAtkImg.src = "/imgs/assets/cloudAtk.png";
const normEnemyAtkImage = new Image();
normEnemyAtkImage.src = "/imgs/assets/normalEnemyAtk.png";

gameField.addEventListener("click", (event) =>event.currentTarget.focus());
//asdasd
document.addEventListener("keyup", (event) => event.preventDefault());
document.addEventListener("keydown", (event) => {
    if (document.activeElement == gameField) event.preventDefault();
});
function updateStatusBar(hp, money, score)
{
    hpDisplay.innerText = `HP: ${hp.health}/${hp.max}`;
    balanceDisplay.innerText = `Money: ${money}`;
    scoreDisplay.innerText = `Score: ${score}`;
}

let failHandler;
let startHandler;
class Game
{
    //realno v nego trq ima vs nujno za zapazvane na sastoqnieto mu t.e. lesno trq stane prodaljavaneto na igrata ot sashtata tochka
    currentRun;
    //trq se zarejda
    player;

    selectedClassIdx;
    //nz
    constructor(player)
    {
        this.player=player;

        startHandler=this.chooseClass.bind(this);

        document.addEventListener("runfail", () => { this.endScreen("Game Over"); });
        document.addEventListener("runsuccess", () => { this.endScreen("You Won!"); });
        
        //lainp
    }
    finishHandler()
    {
        if (userdata == null) return; 

        const score = {
            user:userdata,
            classname:startingClasses[this.selectedClassIdx][1],
            score:this.player.xpgain
        };
        console.log(score);
        
        console.log("saving");
        fetch("api/gamefinish",
            {
                method: "POST",
                headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                body: JSON.stringify(score)
            }
        ).then(response => {
            if (response.status===200) response.json()
                .then(
                    //if(response.status!=200) window.alert("Invalid data!");
                    //else {
                    response => {
                        //localStorage.setItem("currentuser", JSON.stringify(response));
                        userdata = response;
                        console.log("saved");
                    }) 
        })

    }
    endScreen(resultMessage)
    {
        document.removeEventListener("stageadvance", this.currentRun);
        gameField.removeChild(playerStatusBar);
        gameTitle.innerText = resultMessage;

        finalResult.innerText = `Final Score: ${this.player.xpgain}`;

        this.finishHandler();
        this.startScreen();
    }
    //tva mai trqshe da e scene
    //drto ne tui
    start()
    {


        canvas.style.backgroundImage = "linear-gradient(#9d5151, #d4d571)";

        gameField.append(playerStatusBar);
        gameField.removeChild(classDisplay);
        //trq se resetne player

        this.player = new Player(sectorPosition.centerpos.x, sectorPosition.centerpos.y, 100, 169, startingClasses[this.selectedClassIdx][0].maxHealth, startingClasses[this.selectedClassIdx][0].damage, startingClasses[this.selectedClassIdx][0].proposedVelocity, startingClasses[this.selectedClassIdx][2]);
        
        this.currentRun=new GameRun(this.player, 5, 3);
        

        console.log(this);

        //teq ne trq sa anonimni
        
        document.removeEventListener("keydown", startHandler);
        //startButton.removeEventListener("click", startHandler);
        
        
        this.currentRun.generateStages(ctx);
        this.currentRun.play();
        
    }
    startScreen()
    {
        //animatemenu???
        //gameField.append(startMenu);

        canvas.style.backgroundImage="url(/imgs/assets/arenapic.jpg)"

        this.selectedClassIdx=0;

        ctx.clearRect(0,0, canvas.width, canvas.height);
        gameField.append(startMenu);
        
        startButton.addEventListener("click", ()=>{

            
            gameField.removeChild(startMenu);
            
            classDisplay.style.backgroundImage = `url(/imgs/assets/${startingClasses[this.selectedClassIdx][1]}Class.png)`;
            classDisplay.innerText = startingClasses[this.selectedClassIdx][1];
            gameField.append(classDisplay);

            

            if (token == null || token == "") document.addEventListener("keydown", startHandler);
            
            else fetch("api/users/current",
                {
                    method: "GET",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` }
                    //body: JSON.stringify(loggeduser)
                }
            ).then(response => {
                if (response.status === 200) response.json()
                    .then(
                        
                        response => {
                            
                            userdata = response;
                            document.addEventListener("keydown", startHandler);
                        })
                else document.addEventListener("keydown", startHandler);
            });
        }, {once:true});
        

        
        //this.currentRun.play();
    }
    chooseClass(event) {


        const n = startingClasses.length;
        //const classImgs=classMenu.children;
        //console.log(this.currentChoice, i, n);
        switch (event.key) {
            case 'a': this.selectedClassIdx = (this.selectedClassIdx - 1 + n) % n;
                break;
            case 'd': this.selectedClassIdx = (this.selectedClassIdx + 1) % n;
                break;
            case ' ': this.getClass();
                break;

        }
        classDisplay.style.backgroundImage = `url(/imgs/assets/${startingClasses[this.selectedClassIdx][1]}Class.png)`;
        classDisplay.textContent = startingClasses[this.selectedClassIdx][1];

        if (userdata !== null) {
            let spendable = userdata.experience;
            for (const classid of userdata.unlockedclasses) {
                spendable -= startingClasses[classid - 1][3];
            }

            classInfo.innerText = "";
            userBalance.innerText = "";
            if (!userdata.unlockedclasses.includes(this.selectedClassIdx + 1) && startingClasses[this.selectedClassIdx][3] !== 0)
            {
                userBalance.innerText = `Balance: ${spendable}`;
                classInfo.innerText = startingClasses[this.selectedClassIdx][3];
            }
            classDisplay.append(classInfo, userBalance);
        }
            


        updateStatusBar({ health: startingClasses[this.selectedClassIdx][0].maxHealth, max: startingClasses[this.selectedClassIdx][0].maxHealth }, 0, 0);
    }
    getClass()
    {
        if (userdata === null) { this.start(); return; }
        //null?
        if (userdata.unlockedclasses.includes(this.selectedClassIdx + 1)) { this.start(); return; }
        //namira kolko moje da harchi
        //nai-dobre da se napravi otdelen model
        let spendable = userdata.experience;
        for (const classid of userdata.unlockedclasses)
        {
            spendable -= startingClasses[classid - 1][3];
        }

        if (spendable >= startingClasses[this.selectedClassIdx][3])
        {
            fetch(`api/classunlock/${(this.selectedClassIdx+1)}`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
                    //body: JSON.stringify(userdata)
                }
            ).then(response => {
                if (response.status === 200) response.json()
                    .then(
                        //if(response.status!=200) window.alert("Invalid data!");
                        //else {
                        response => {
                            //localStorage.setItem("currentuser", JSON.stringify(response));
                            userdata = response;
                            console.log("classunlocked"); this.start();
                        })
            })
        }
            
    }
    //???
    winScreen(){}
    update()
    {
        //startmenu anim
    }
}

let keyHandler;
//za otdelniq stage - enemy enc. i selectscreen
class GameScene
{
    stageState=StageState.running;
    player;

    animreq;
    constructor(player)
    {
        this.player=player;
        
    }
    initiate()
    {

    }

}
const StageState={
    
    running:0,
    //tva nz dali mi trqbva
    //paused/quit=1,
    success:1,
    fail:2

}
function movePlayer(event, player, enemy, predicate, velx, vely, newSector)
{
    if (predicate) {
        
        player.velx=velx; player.vely=vely;
        //proverqva dali e blokiran i ne e dolu v momenta
        if (!(enemy.blocking && newSector == sector.center)) player.currentSector = newSector;
        if (enemy.blocking) {player.vely = -player.jumpVel}
        if (event.shiftKey) setTimeout(()=>{player.invincibility=true; player.dodging=true;},100);}
        //if (!enemy.blocking&&lower) player.currentSector=sector.center;
} 

//moje bi da dobavq upgcontroller?(sig nqma nujda)
//sashto taka moje bi zabraig :skull:
class SelectionScreen extends GameScene
{
    upgradeOptions = [];

    upgradeNames = [];
    
    currentChoice;
    constructor (player, upgradeOptions, upgradeNames)
    {
        super(player);
        this.upgradeOptions = upgradeOptions;
        this.upgradeNames = upgradeNames;
        
        this.currentChoice=upgradeOptions[0];
        
    }
    //update(context)
    //{
    //    //tuka trq sloja animaciq za bg
    //    //tuka se vkarvat izobrajeniqta ot html
    //    //bruh
    //}
    initiate()
    {
        //keyHandler=this.upgradeSelect(event).bind(this);
        document.addEventListener("keydown", this, false);
        exitHandler=this.exitScene.bind(this);
        document.addEventListener("upgradeget", exitHandler);

        gameField.append(upgradeMenu);

        upgradeMenu.append(uMenuTitle);
        uMenuTitle.innerText = "Choose an upgrade";

        //byuta izobrajeniqta za upgr
        let upgradeImgs=[];
        for (const upgr of this.upgradeOptions)
        {
            const l=upgradeImgs.push(document.createElement("div"));

            const uptext = document.createElement("span");
            uptext.innerText = this.upgradeNames[l - 1];
            upgradeImgs[l - 1].append(uptext);
            //trq se sloji src i zaglavie
            upgradeMenu.append(upgradeImgs[l-1]);

        }

        //this.animateScene(context);
        
    }
    exitScene()
    {
        
        if (this.currentChoice!=null) this.currentChoice.apply(this.player);
        document.removeEventListener("keydown", this, false);
        document.removeEventListener("upgradeget", exitHandler);
        gameField.removeChild(upgradeMenu);
        //trq gi mahne poneje posle shte sa razlichni
        
        while(upgradeMenu.firstChild)
        {
            upgradeMenu.removeChild(upgradeMenu.firstChild);
        }
        console.log('exit');
        
        document.dispatchEvent(stageAdvance);
        
    }
    //animateScene(context)
    //{
       
    //}
    #styleChosenUpgr(imgs, idx)
    {
        for (let i=0; i<idx; i++)
            imgs[i].classList.remove("selectedUpgrade");
        imgs[idx].classList.add("selectedUpgrade");
        for (let i=idx+1; i<imgs.length; i++)
            imgs[i].classList.remove("selectedUpgrade");
        
    }
    //handler
    //upgradeSelect
    handleEvent(event)
    {
        const i=this.upgradeOptions.indexOf(this.currentChoice);
        const n=this.upgradeOptions.length;
        const upgradeImgs = document.querySelectorAll(".upgradeMenu>div");
        //console.log(this.currentChoice, i, n);
        switch (event.key)
        {
            //bullfuckingshit
            case 'a': {this.currentChoice=this.upgradeOptions[(i-1+n)%n]; this.#styleChosenUpgr(upgradeImgs, ((i-1+n)%n));}
                break;
            
            case 'd':  {this.currentChoice=this.upgradeOptions[(i+1)%n];this.#styleChosenUpgr(upgradeImgs, ((i+1)%n));}
                break;
            case ' ':  {this.stageState=StageState.success; document.dispatchEvent(upgradeGet);}
                break;
            case 'Shift': {this.player.xpgain+=20; this.currentChoice=null; this.stageState=StageState.success; document.dispatchEvent(upgradeGet);}
                break;       
        }
    }
    

}
class Shop extends SelectionScreen
{
    prices=[];
    constructor(player, upgradeOptions, upgradeNames, prices)
    {
        super(player, upgradeOptions, upgradeNames);
        this.prices=prices;
        //zapalva praznite;shte se obhojdat itemite taka che dopalva cenite pri nedostatachnost
        for (let i=prices.length; i<upgradeOptions.length; i++)
            this.prices.push(0);
    }
    initiate()
    {
        super.initiate();


        const upgradeImgs = document.querySelectorAll(".upgradeMenu>div");
        
        
        uMenuTitle.innerText = "Shop";

        for (let i = 0; i < upgradeImgs.length; i++)
        {
            const uprice = document.createElement("span");
            uprice.innerText = this.prices[i];
            upgradeImgs[i].append(uprice);

        }

    }
    //trq se dopalnqt nqkoi neshta eventualno
    #styleChosenUpgr(imgs, idx)
    {
        for (let i=0; i<idx; i++)
            imgs[i].classList.remove("selectedUpgrade");
        imgs[idx].classList.add("selectedUpgrade");
        for (let i=idx+1; i<imgs.length; i++)
            imgs[i].classList.remove("selectedUpgrade");
        
    }
    handleEvent(event)
    {
        const i=this.upgradeOptions.indexOf(this.currentChoice);
        const n=this.upgradeOptions.length;
        const upgradeImgs = document.querySelectorAll(".upgradeMenu>div");
        
        switch (event.key)
        {
            //bullfuckingshit
            case 'a': {if (this.currentChoice==null) return; this.currentChoice=this.upgradeOptions[(i-1+n)%n]; this.#styleChosenUpgr(upgradeImgs, ((i-1+n)%n));}
                break;
            
            case 'd':  {if (this.currentChoice==null) return; this.currentChoice=this.upgradeOptions[(i+1)%n];this.#styleChosenUpgr(upgradeImgs, ((i+1)%n));}
                break;
            case ' ':  {this.purchaseItem();/*this.stageState=StageState.success; document.dispatchEvent(upgradeGet);*/}
                break;
            case 'Shift': {this.currentChoice=null; this.stageState=StageState.success; document.dispatchEvent(upgradeGet);}
                break;       
        }
        
    }
    //trq i da se ocvetqva!!
    //cenite sa schupeni
    purchaseItem()
    {
        if (this.currentChoice==null) return;
        const i=this.upgradeOptions.indexOf(this.currentChoice);
        const n=this.upgradeOptions.length;
        const upgradeImgs = document.querySelectorAll(".upgradeMenu>div");
        
        
        if (this.player.money<this.prices[i]) {console.log("nqma kinit", this.prices[i]); return;}
        this.player.money-=this.prices[i];
        this.player.xpgain-=Math.round(this.prices[i]/2);

        this.currentChoice.apply(this.player);

        upgradeMenu.removeChild(upgradeImgs[i]);
        this.upgradeOptions.splice(i, 1);
        this.prices.splice(i, 1);
        this.currentChoice=this.upgradeOptions.length>0?this.upgradeOptions[(i+1)%(n-1)]:null;

        updateStatusBar({ health: this.player.health, max: this.player.maxHealth }, this.player.money, this.player.xpgain);

        playerHPBar.update(ctx, this.player);
    }
    //bruh
    exitScene()
    {
        
        document.removeEventListener("keydown", this, false);
        document.removeEventListener("upgradeget", exitHandler);
        gameField.removeChild(upgradeMenu);
        //trq gi mahne poneje posle shte sa razlichni
        console.log('exit');
        while(upgradeMenu.firstChild)
        {
            upgradeMenu.removeChild(upgradeMenu.firstChild);
        }
        
        
        document.dispatchEvent(stageAdvance);
        //window.cancelAnimationFrame(this.animreq);//????
    }

}
let exitHandler;
class EnemyEncounter extends GameScene
{
    enemy;

    rewardScreen;

    startingHealth;

    
    constructor (player, enemy, reward)
    {
        super(player);
        this.enemy=enemy;
        this.rewardScreen=reward;
        //console.log(enemy);
        
    }
    initiate()
    {
        //keyHandler=this.playerAction.bind(this);
        document.addEventListener("keydown", this, false);
        exitHandler=this.exitScene.bind(this);
        document.addEventListener("enemydefeat", exitHandler);
        
        this.startingHealth = this.player.health;
        animreq = setInterval(()=>this.animateScene(), 1000 / 60);
        //this.exitScene();

        

    }
    exitScene()
    {
        document.removeEventListener("keydown", this, false);
        document.removeEventListener("enemydefeat", exitHandler);
        //moje bi da se sloji tiemoutche da ne spre vednaga
        clearInterval(animreq);

        if (this.player.health <= 0) return;
        //resetva se
        this.player.currentSector=sector.center;
        this.player.posx=sectorPosition.centerpos.x;
        this.player.posy=sectorPosition.centerpos.y;
        this.player.velx=0;
        this.player.vely=0;
        /*if (this.enemy.blocking) {this.player.proposedVelocity/=2; }*///gravity mai ne trq se restartira
        this.player.gravity = 0;
        this.player.attacking = false;
        this.player.atkvel=0;

        updateStatusBar({ health: this.player.health, max: this.player.maxHealth }, this.player.money, this.player.xpgain);
        //oh shit
        //trq 
        //???trq go opraq
        this.rewardScreen.initiate();

    }
    animateScene()
    {
        
        if (this.enemy.health<=0) {
            this.stageState=StageState.success; 
            const moneyGain=Math.round(this.enemy.maxHealth/10+this.enemy.damage/2);
            
            
            this.player.money+=moneyGain;
            this.player.xpgain+=moneyGain+Math.round(moneyGain*2*this.player.health/this.startingHealth);

            clearInterval(animreq);
            document.dispatchEvent(enemyDefeat);
            return;
        }
        if (this.player.health<=0) {this.stageState=StageState.fail; this.exitScene(); document.dispatchEvent(runFail); return;}
        ctx.clearRect(0,0, canvas.width, canvas.height);
        this.enemy.update(ctx, this.player);
        this.player.update(ctx, this.enemy);
        playerHPBar.update(ctx, this.player);
        
        
        //animreq=window.requestAnimationFrame(()=>this.animateScene());
    }
    //playerAction
    handleEvent(event)
    {
        
        //smenq na pravilnata poziciq s f-iq
        if (this.player.recovery) return;
        //tuk po-skoro trq se opravi da moje da se mesti m/u 2 i eventualno da spira
        if (this.player.velx !== 0 || this.player.vely !== 0 || this.player.atkvel) return;
        switch (event.key)
        {
            //bullfuckingshit
            case 'w': case 'W': movePlayer(event, this.player, this.enemy, this.player.currentSector[0]&&this.player.currentSector[1], 0, -this.player.proposedVelocity,sector.center);
                break;
            case 'a': case 'A': movePlayer(event, this.player, this.enemy, this.player.currentSector[0]!==this.player.currentSector[1], 
                -this.player.proposedVelocity, this.player.proposedVelocity*(-1+2*(+!this.player.currentSector[0]))*(sectorPosition.upperLaneVDiff/sectorPosition.hdiff), 
                [!this.player.currentSector[0], false]); 
                break;
            case 's': case 'S': movePlayer(event, this.player, this.enemy, this.player.currentSector[0]&&!this.player.currentSector[1], 0, this.player.proposedVelocity,sector.lower);
                break;
            case 'd': case 'D': movePlayer(event, this.player, this.enemy, !(this.player.currentSector[0]&&this.player.currentSector[1])&&!this.player.currentSector[1],
                this.player.proposedVelocity, this.player.proposedVelocity*(-1+2*(+!this.player.currentSector[0]))*(sectorPosition.upperLaneVDiff/sectorPosition.hdiff),
                [!this.player.currentSector[0],(this.player.currentSector[0]||this.player.currentSector[1])]);
                break;
            case ' ': {if (this.player.velx==0&&this.player.vely==0) this.player.attack(ctx);} break;       
        }
        
    }
}
//event za krtaain

//za nov run-instanciq na igrata
class GameRun
{
    player;
    stageCount;
    areaCount;
    stages;
    currentStage;

    curStageIdx=0;
    curAreaIdx=0;
    constructor (player, stageCount, areaCount)
    {
        this.player=player;
        this.stageCount=stageCount;
        this.areaCount=areaCount;
        //bruh trq se mahne
        //veche e v game 👍
        //samo remove e tam
        document.addEventListener("stageadvance", this);
        
    }
    generateStages(context)
    {
        this.stages=[];
        let stageTypeRNG;
        let enemyTypeRNG;
        let upgradeRNG;
        let shopGenerated;
        //placeholder
        //vse edno tuk ima neshto koeto ne e placeholder :skull:
        
        
        // const testUpgradeOptions=[new PlayerUpgrade(0, 0, 0, 0, 50),new PlayerUpgrade(0, 0, 0, 0, 50),new PlayerUpgrade(0, 0, 0, 0, 50)];
        
        //oshte nqma valuta shit
        


        for (let i=0; i<this.areaCount; i++)
        {
            const testUpgradePrices = Array(3).fill(0);
            this.stages[i] = [];
            shopGenerated=false;
            for (let j=0; j<this.stageCount; j++) 
            {
                stageTypeRNG=Math.floor(Math.random()*this.stageCount);
                //samo za teq dvata bachka f-lata po-dolu
                enemyTypeRNG=Math.floor(Math.random()*3)%2;//2:1 za parviq
                
                //nachalnoto nq znachenie shoto e random, sledvashtite izbirat sluchaino, razlichno ot preedishnoto
                let upgradeOptions = [];
                let upgradeNames = [];
                let vacant=[];
                for (let idx=0; idx<upgradeTypes.length; idx++) vacant[idx]=idx;
                
                for (let idx=0; idx<3; idx++)
                {
                    upgradeRNG=Math.floor(Math.random()*(upgradeTypes.length-idx));
                    upgradeRNG=vacant[upgradeRNG];
                    vacant.splice(vacant.indexOf(upgradeRNG), 1);
                    upgradeOptions[idx] = upgradeTypes[upgradeRNG][0];
                    upgradeNames[idx] = upgradeTypes[upgradeRNG][1];
                }
                
                if ((stageTypeRNG===0&&!shopGenerated&&j>0)||(!shopGenerated&&j===this.stageCount-1)) {
                    //const multRNG=(upgr)=>{const multrng=1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2); return new PlayerUpgrade(upgr.maxHpIncrease*multrng, upgr.damageIncrease*multrng, upgr.velIncrease*multrng, upgr.atkVelIncrease*multrng, upgr.heal*multrng);}
                    //upgradeOptions.map((upgr)=>{new PlayerUpgrade(upgr.maxHpIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgr.damageIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgr.velIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgr.atkVelIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgr.heal*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)));});
                    for (let idx=0; idx<3; idx++) upgradeOptions[idx]=new PlayerUpgrade(upgradeOptions[idx].maxHpIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgradeOptions[idx].damageIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgradeOptions[idx].velIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgradeOptions[idx].atkVelIncrease*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2)), upgradeOptions[idx].heal*(1+Math.floor(Math.random()*2)*Math.floor(Math.random()*2))); 

                    this.stages[i][j] = new Shop(this.player, upgradeOptions, upgradeNames, testUpgradePrices); shopGenerated=true;


                    //setva cenata spored tui koe kolko e cenno
                    for (let idx = 0; idx < 3; idx++)
                        this.stages[i][j].prices[idx] =
                            Math.round(upgradeOptions[idx].maxHpIncrease * 2 + upgradeOptions[idx].damageIncrease * 10 + upgradeOptions[idx].velIncrease * 20 + upgradeOptions[idx].atkVelIncrease * 2 + upgradeOptions[idx].heal)
                            * (1 + i / 2);
                    console.log(this.stages[i][j].prices);
                    
                }//trqbvat shabloni za randomizirane//veche ima
                else this.stages[i][j] = new EnemyEncounter(this.player,
                    new Enemy(enemyTypes[enemyTypeRNG].posx, enemyTypes[enemyTypeRNG].posy, enemyTypes[enemyTypeRNG].hBoxWidth, enemyTypes[enemyTypeRNG].hBoxHeight, enemyTypes[enemyTypeRNG].health * (1 + i / 2), enemyTypes[enemyTypeRNG].damage * (1 + i / 2), enemyTypes[enemyTypeRNG].aoeAtk, enemyTypes[enemyTypeRNG].characterImage),
                    new SelectionScreen(this.player, upgradeOptions, upgradeNames), context);//trq vav vs da ima vrazka kam sledvashtiq upgrade sel screen //veche mai ima????
            
            }
        }
        this.currentStage=this.stages[0][0];
    }
    play()
    {
        
        this.currentStage.initiate();
        //trq mine kam win screen ili nachaloto
        //tova nz zashto sam go pisal tuka
    }
    //nextStage
    handleEvent() {
        //this.currentStage.exitScene();
        //trq se sloji indeksa
        //console.log(this.currentStage, this.stages);
        this.player.xpgain += 100 * (this.curStageIdx + 1);
        updateStatusBar({ health: this.player.health, max: this.player.maxHealth }, this.player.money, this.player.xpgain);
        if (this.curAreaIdx===this.areaCount-1&&this.curStageIdx===this.stageCount-1) { this.player.xpgain+=1000; document.dispatchEvent(runSuccess); console.log("W");return;}
        this.curAreaIdx+=Math.floor((++this.curStageIdx)/this.stageCount);
        this.curStageIdx%=this.stageCount;
        this.currentStage=this.stages[this.curAreaIdx][this.curStageIdx];

        

        this.currentStage.initiate();

    }


}
const runFail=new Event("runfail");
const enemyDefeat=new Event("enemydefeat");
const upgradeGet=new Event("upgradeget");
const stageAdvance=new Event("stageadvance");
const runSuccess=new Event("runsuccess");
class PlayerUpgrade
{
    maxHpIncrease=0;
    damageIncrease=0;
    velIncrease=0;
    atkVelIncrease=0;
    heal=0;
    constructor (hp, dmg, vel, atkvel, heal)
    {
        this.maxHpIncrease=hp;
        this.damageIncrease=dmg;
        this.velIncrease=vel;
        this.atkVelIncrease=atkvel;
        this.heal=heal;
    }
    apply(player)
    {
        player.maxHealth+=this.maxHpIncrease;
        player.damage+=this.damageIncrease;
        player.proposedVelocity+=this.velIncrease;
        //player.atkvel+=this.atk;
        player.health=Math.min((player.health+this.heal), player.maxHealth);
    }
}

const sector={
    center: [true, false],
    lower: [true, true],
    left: [false, false],
    right: [false, true]
}
const sectorPosition={
    centerpos: {x: 600, y:240},
    hdiff: 200,
    upperLaneVDiff: 20,
    vdiff: 200,
    //upperLeftPos: {x: this.centerpos.x-this.hdiff, y:this.centerpos.y+this.upperLaneVDiff},
    //upperRightPos: {x: this.centerpos.x+this.hdiff, y:this.centerpos.y+this.upperLaneVDiff},
    //lowerpos: {x: this.centerpos.x, y:this.centerpos.y-this.vdiff},
    targetPosition(sctr)
    {
        posx=this.centerpos.x+(!sctr[0])*(-1+2*(+sctr[1]))*this.hdiff;
        posy=this.centerpos.y-(!sctr[0])*this.upperLaneVDiff+(sctr[0]&&sctr[1])*this.vdiff;
        //console.log(+inUpperLane*(-1+2*(+sctr[0]))*this.upperLaneVDiff, +!inUpperLane*(+sctr[0])*(-1+2*(+sctr[1]))*this.vdiff);
        return {x:posx, y:posy}
    }
}
const enemyPosition={
    hoffset: 20,
    voffset: 100
}
const playerAttack={
    width: 69,
    relativeHeight(srcHeight)
    {
        return srcHeight/4;
    },
    relativePosition(player)
    {
        return {x: player.posx-(+!player.currentSector[0])*this.relativeHeight(player.hBoxHeight)+((player.currentSector[0]||!player.currentSector[1])?player.hBoxWidth:this.relativeHeight(player.hBoxHeight)),
                y: player.posy+(2+player.currentSector[0])*this.relativeHeight(player.hBoxHeight)}
    },
    // baseAttackHitBox()
    // {
    //     return this.getAttackHitBox;
    // },
    getAttackHitBox(player)
    {
        return new HitBox(this.relativePosition(player).x,
        this.relativePosition(player).y, 
        player.currentSector[0]?this.width:this.relativeHeight(player.hBoxHeight), 
        player.currentSector[0]?this.relativeHeight(player.hBoxHeight):this.width);
    }
}
const enemyAttack={
    width: 69,
    relativeHeight(srcHeight)
    {
        return srcHeight/2;
    },
    relativePosition(enemy)
    {
        
        //💀💀💀👺👺💀💀🤡🤡🤡
        const typecoeff=enemy.hBoxWidth<150;
        const offset=-45;
        
        return {x: enemy.posx+(enemy.facingRight?enemy.hBoxWidth-typecoeff*offset:+typecoeff*offset-this.width),
                y: enemy.posy+(1-2*(+enemy.mirror))*this.relativeHeight(enemy.hBoxHeight)}
    },
    // baseAttackHitBox()
    // {
    //     return this.getAttackHitBox;
    // },
    getAttackHitBox(enemy)
    {
        return new HitBox(this.relativePosition(enemy).x,
        this.relativePosition(enemy).y, 
        this.width, 
        this.relativeHeight(enemy.hBoxHeight));
    }
}
//enemytype1


class HealthBar
{
    posx;
    posy;
    width;
    height;
    // maxHealth;
    // currentHealth;
    constructor(x, y, width, height)
    {
        this.posx=x;
        this.posy=y;
        this.width=width;
        this.height=height;
        
        //this.maxHealth=maxhp;
    }
    update(context, entity)
    {
        context.fillStyle="gray";
        context.fillRect(this.posx, this.posy, this.width, this.height);
        context.fillStyle="red";
        context.fillRect(this.posx, this.posy, this.width*(entity.health/entity.maxHealth), this.height);
    }
}
class Position
{
    x;
    y;
    constructor (x, y)
    {
        this.x=x;
        this.y=y;
    }
}
class HitBox
{
    posx;
    posy;
    width;
    height;

    constructor(posx, posy, width, height)
    {
        this.posx=posx;
        this.posy=posy;
        this.width=width;
        this.height=height;
        
    }
    show(context, fillcolor, img)
    {
        
        //context.fillStyle = fillcolor;
        //context.fillRect(this.posx, this.posy, this.width, this.height);

        context.drawImage(img, this.posx, this.posy);

        
    }
}
class GameCharacter
{
    posx;
    posy;
    hBoxWidth;
    hBoxHeight;
    velx;
    vely;
    acceleration;
    maxHealth;
    health;
    damage;
    recovery = false;

    characterImage;

    proposedAtkVelocity;
    //hit nishto ne pravi za enemy v momenta

    atkhBox;
    atkvel=0;
    attacking=false;
    //currentSector;
    constructor(posx, posy, width, height, health, damage, img)
    {
        this.posx=posx;
        this.posy=posy;
        this.hBoxWidth=width;
        this.hBoxHeight=height;
        this.velx=0;
        this.vely=0;
        this.acceleration=1;
        this.health=health;
        this.maxHealth=health;
        this.damage=damage;
        //this.currentSector=sector.center;
        this.characterImage = img;
        
    }
    showHitBox(context, fillcolor)
    {
        context.fillStyle=fillcolor;
        ctx.globalAlpha = 0.5;
        //context.fillRect(this.posx, this.posy, this.hBoxWidth, this.hBoxHeight);
        ctx.globalAlpha = 1;
    }
    hitDetection(context, enemy, gainInvincibility)
    {
        
        const hit =
            (enemy.atkhBox.posx + enemy.atkhBox.width >= this.posx
                && enemy.atkhBox.posx <= this.posx + this.hBoxWidth
                && enemy.atkhBox.posy + enemy.atkhBox.height >= this.posy
                && enemy.atkhBox.posy <= this.posy + this.hBoxHeight)
                    && enemy.atkvel != 0 && !this.invincibility && enemy.attacking;
        if (hit)
        {
            this.health-=enemy.damage;
            /*console.log(this.health);*/
            //this.showHitBox(context, "white");
            
            enemy.attacking = gainInvincibility;

            if (!gainInvincibility) return hit;
            this.invincibility=true;
            this.recovery=true;
            //trqbva da chekva za enemy atk vmesto tout
            setTimeout(() => { /*this.recovery = false;*/ this.invincibility = false; }, 750);
            setTimeout(() => { this.recovery = false;  }, 500);  

            
        }
        return hit;
    }
    update(context)
    {
        //context.clearRect(0,0, canvas.width, canvas.height);
        //just rand shit!TODEL!!
        //if(this.posx+this.hBoxWidth>=canvas.width||this.posx<=0) this.velx*=-1;
        //if(this.posy+this.hBoxHeight>=canvas.height||this.posy<=0) this.vely*=-1;
        
        this.posx+=this.velx;
        this.posy+=this.vely;
        //posle img
        //this.stop();

        
        //this.showHitBox(context, "green");
    }
}
const plAtkBoxWidth=69;
class Player extends GameCharacter
{
    //trq go vkaram po-kasno
    proposedVelocity;
    //proposedAtkVelocity;
    atkrange;

    jumpVel=basePlayer.proposedVelocity*2;
    //za kogato e blokiran dolu
    gravity = 0;
    //dodge-inv., moje da go izp. i zaiframes pr hit, t.e inv. da se razdeli ot hit i da moje da se marda s nego(?)
    dodging=false;
    //teq po-skoro trq sa v gamerun???
    money=0;
    xpgain=0;

    constructor(posx, posy, width, height, health, damage, pvel, img)
    {
        super(posx, posy, width, height, health, damage, img);
        
        this.velx=0;
        this.vely=0;
        this.acceleration=1;
        this.currentSector=sector.center;
        this.proposedVelocity=pvel;
        //this.atkhBox=new HitBox(posx+width, posy+3*height/4, plAtkBoxWidth, height/4);
        this.atkhBox=playerAttack.getAttackHitBox({posx:posx, posy:posy, currentSector:sector.center, hBoxWidth:width, hBoxHeight:height});

        this.atkrange=posy;
    }
    stop()
    {
        //const isDown=player.currentSector[0]&&player.currentSector[1];
        //const isLeftRight=(player.currentSector[0]&&!player.currentSector[1])&&!isDown;
        //kade se namira sprqmo celeviq sektor
        const dirx=(Math.abs(this.velx)/this.velx);
        let diry=(Math.abs(this.vely)/this.vely);

        if(this.gravity!=0 ) diry=1;
        //izchislqva kade e i spira spored tova v koq sekciq e
        if (dirx * this.posx >= dirx * sectorPosition.targetPosition(this.currentSector).x) {
            this.velx = 0; this.posx = sectorPosition.targetPosition(this.currentSector).x;
        //vremenno spira sled dodge
            if (this.dodging) {this.dodging=false; this.invincibility=false; this.recovery=true; setTimeout(()=>this.recovery=false, 100);}}

        if (diry * this.posy >= diry * sectorPosition.targetPosition(this.currentSector).y) {
            this.vely = 0; this.posy = sectorPosition.targetPosition(this.currentSector).y;
            if (this.dodging) {this.dodging=false; this.invincibility=false; this.recovery=true; setTimeout(()=>this.recovery=false, 100);}}
        //!!povtarq se!!
    }
    //ne se polzva 💀
    dodge()
    {
        setTimeout(()=>this.dodging=true,100);
    }
    hitDetection(context, enemy, gainInvincibility)
    {
        if (this.invincibility) return false;
        
        if (super.hitDetection(context, enemy, gainInvincibility))
        {
            updateStatusBar({ health: this.health, max: this.maxHealth }, this.money, this.xpgain);
            return true;
        }
    }
    update(context, enemy)
    {
        
        super.update(context);
        
        //trq otide v konstruktora shit

        
        if (this.invincibility) { /*this.showHitBox(context, "white");*/ context.globalAlpha = 0.2; }
        if(this.posy<sectorPosition.targetPosition(sector.lower).y&&enemy.blocking)this.vely+=this.gravity;
        this.stop();
        context.drawImage(this.characterImage, this.posx, this.posy);
        context.globalAlpha = 1;
        //console.log(this.velocity);
        this.hitDetection(context, enemy, true);
        //nq bachka kato se smeni poz!!veche mai shte bachka
        const atkdir=(-1+2*(+this.currentSector[0]||this.currentSector[1]));
        //spira da atk kato stigne rng ili hit ili marda
        if (atkdir*(this.currentSector[0]?this.atkhBox.posy:this.atkhBox.posx)<=atkdir*this.atkrange||this.recovery||this.velx!=0||this.vely!=0) {this.atkvel=0; this.attacking=false;
        /*this.atkhBox=new HitBox(this.posx+this.hBoxWidth, this.posy+3*this.hBoxHeight/4, this.atkhBox.width, this.atkhBox.height);*/}
        this.atkhBox.posy+=-this.currentSector[0]*this.atkvel;
        this.atkhBox.posx+=(1-2*(+this.currentSector[1]))*(+!this.currentSector[0])*this.atkvel;
        if (this.atkvel != 0)
        {
            if (!this.currentSector[0]) {
                context.save();
                context.translate(this.atkhBox.posx + (+!this.currentSector[1]) * this.atkhBox.width, this.atkhBox.posy);
                context.rotate((1 - 2 * (+this.currentSector[1])) * Math.PI / 2);
                context.scale((1 - 2 * (+this.currentSector[1])), 1)
                const temp = { x: this.atkhBox.posx, y: this.atkhBox.posy };
                this.atkhBox.posx = 0; this.atkhBox.posy = 0;
                this.atkhBox.show(context, "red", weaponNormalImg);
                this.atkhBox.posx = temp.x; this.atkhBox.posy = temp.y;
                context.restore();
            }
            else {
                //rotate?
                this.atkhBox.show(context, "red", weaponNormalImg);
            }
        }
    }
    attack(context)
    {
        if(this.attacking||this.atkvel!=0) return;
        //izchislqva poz spramo sektora
        this.atkhBox=playerAttack.getAttackHitBox(this);
        //kade e krainata tochka t.e. kade spira atkta
        this.atkrange=this.currentSector[0]?this.posy:(this.posx+(1-2*(+this.currentSector[1]))*3*this.hBoxHeight/4+!this.currentSector[1]*this.hBoxWidth);

        this.attacking=true;
        this.showHitBox(context, "black");
        //setTimeout (()=>{this.atkvel=10;}, 500);
        this.atkvel=10;
        
    }
    
}
class Enemy extends GameCharacter
{
    //dali e obarnat ili blokira dolu
    facingRight=true;
    blocking=false;
    //samo edno ot dvete ima za secondary atk taka
    aoeAtk;
    mirror=false;

    basePos;
    constructor(posx, posy, width, height, health, damage, aoe, img)
    {
        super(posx, posy, width, height, health, damage, img)
        this.atkhBox=enemyAttack.getAttackHitBox({posx:posx, posy:posy,hBoxWidth:width, hBoxHeight:height, facingRight:true});
        this.basePos={x:posx, y:posy};

        this.aoeAtk=aoe;
        //this.attacking=false;
        
    }
    update(context, player)
    {
        //context.save();
        //const tempImg=
        super.update(context);
        //context.restore();

        if (super.hitDetection(context, player, false)) context.globalAlpha = 0.2; 
        

        context.drawImage(this.characterImage, this.posx, this.posy);
        //this.showHitBox(context, "yellow");
        
        context.globalAlpha = 1;

        if (Math.floor(Math.random() * 60 / (1 + player.attacking + (player.atkvel!=0))) === 0) this.attack(context, player);
        
        const atkdir=-1+2*(+this.facingRight);
        
        if (atkdir*this.atkhBox.posx-!this.facingRight*this.atkhBox.width<=atkdir*this.posx-this.mirror*sectorPosition.hdiff-!this.facingRight*this.hBoxWidth) {
            /*ne moje da atakuva izvestno vreme*/
            //mai ne bachka pri a2 
            if (this.atkvel!=0&&this.recovery)setTimeout (()=>{this.recovery=false;}, 500);
            this.atkvel=0; this.attacking=false; 
        /*this.atkhBox=new HitBox(this.posx+this.hBoxWidth, this.atkhBox.posy, this.atkhBox.width, this.atkhBox.height);*/}
        //if(this.atkhBox===undefined) return;
        
        this.atkhBox.posy+=this.atkvel*(+(this.mirror&&(this.atkhBox.posy<(this.posy+this.atkhBox.height))))
        this.atkhBox.posx-=atkdir*this.atkvel*(+!(this.mirror&&(this.atkhBox.posy<(this.posy+this.atkhBox.height))));
        //ako zapochva e bleda no se pokazva
        if (this.atkvel != 0 || this.attacking) {
            if (this.atkvel===0) context.globalAlpha = 0.5;

            const curatkimg = (this.mirror && this.atkhBox.posy >= this.posy + this.atkhBox.height) ? cloudAtkImg : normEnemyAtkImage;

            context.save();

            
            //context.translate(this.atkhBox.posx, this.atkhBox.posy);

            context.translate(this.atkhBox.posx + !this.facingRight * this.atkhBox.width, this.atkhBox.posy);
            context.scale(atkdir, 1);

            context.drawImage(curatkimg, 0, 0);
         
            context.restore();
            //this.atkhBox.show(context, "red", curatkimg);
        }
        
        if(this.atkvel!=0&&this.mirror&&this.atkhBox.posy>=this.posy+this.atkhBox.height) 
        {
            
            const mirrorBox=new HitBox(2*enemyAttack.relativePosition(this).x-this.atkhBox.posx, this.atkhBox.posy, this.atkhBox.width, this.atkhBox.height);

            context.save();

            //context.translate(mirrorBox.posx, mirrorBox.posy);

            context.translate(mirrorBox.posx + mirrorBox.width, mirrorBox.posy);
            context.scale(-atkdir, 1);
            //const temp = { x: mirrorBox.posx, y: mirrorBox.posy };
            //trq se prenaredi tuka shtoto mbox e temp i bez tova
            mirrorBox.posx = 0; mirrorBox.posy = 0;

            
            mirrorBox.show(context, "red", cloudAtkImg);

            context.restore();
        };
        context.globalAlpha = 1;
        //vrashta kam orig sastoqnie??nztova koga sam go pisal
        //
        
    }
    //samo inicializaciqta
    attack(context, player)
    {
        
        //!IMPORTANT
        //secondary atk, za po-kasno TRQ se napr klas za ataki i kolekciq kato pole za enemy/pl/ sashto enum za sastoqnie che da nqma 1000flaga
        
        
        if(this.attacking||this.atkvel!=0||(!this.attacking&&this.recovery)) return;
        
        this.mirror=false;

        this.recovery=true;
        if (Math.floor(Math.random()*4)===0)
        {
            
            this.mirror=this.aoeAtk;
            //trq
            if (!this.mirror)
                //this.setTimeout(()=>(this.attack()), 1000);
            this.recovery=false;
        }
        //gleda kade e i se obrashta...trqbva da stane dinamichno
        if (!(player.currentSector[0]||player.currentSector[1])||((Math.floor(Math.random()*2)===0)&&(player.currentSector[0]&&!player.currentSector[1]))) {
            this.facingRight=false; this.posx=sectorPosition.centerpos.x-this.hBoxWidth+player.hBoxWidth+enemyPosition.hoffset;
            //this.atkhBox=new HitBox(this.posx-this.atkhBox.width, this.atkhBox.posy, this.atkhBox.width, this.atkhBox.height);
            }
        else {
            this.facingRight=true; this.posx=sectorPosition.centerpos.x-enemyPosition.hoffset;
            //this.atkhBox=new HitBox(this.posx+this.hBoxWidth, this.atkhBox.posy, this.atkhBox.width, this.atkhBox.height);
            }
        //dali da se premesti dolu;taka blokira....sashto ne e dinamichno zasq
        //basepos mai shte svarshi taq rabota vsashtnost
        if (player.currentSector[0] && player.currentSector[1] && !this.blocking) {
            this.facingRight = true; this.blocking = true;/* player.proposedVelocity *= 2;*/ player.gravity = player.jumpVel / 30;
            this.posx=sectorPosition.centerpos.x-enemyPosition.hoffset; this.posy=sectorPosition.targetPosition(sector.lower).y-enemyPosition.voffset;
            //atkbox poz ne e din.
            //this.atkhBox=new HitBox(this.posx+this.hBoxWidth, this.posy+this.hBoxHeight/2, this.atkhBox.width, this.atkhBox.height);
            }
            this.atkhBox=enemyAttack.getAttackHitBox(this);
        
        this.attacking=true;
        this.showHitBox(context, "red");
        setTimeout (()=>{this.atkvel=5;}, 500);
    }
}

const regularEnemy = new Enemy(sectorPosition.centerpos.x - enemyPosition.hoffset, sectorPosition.centerpos.y - enemyPosition.voffset, 169, 200, 200, 20, true, bruteEnemyImg);
const fastEnemy = new Enemy(sectorPosition.centerpos.x - enemyPosition.hoffset, sectorPosition.centerpos.y - enemyPosition.voffset, 130, 200, 100, 10, false, regEnemyImg);
const enemyTypes=[fastEnemy, regularEnemy];

const basePlayer={
    posx:sectorPosition.centerpos.x,
    posy:sectorPosition.centerpos.y,
    hBoxWidth:100, 
    hBoxHeight:169,
    maxHealth:100, 
    damage:10,
    proposedVelocity:10

};
const startingClasses=[
    [basePlayer, "Normal", normalImg, 0],
    [{
        posx:sectorPosition.centerpos.x,
        posy:sectorPosition.centerpos.y,
        hBoxWidth:100, 
        hBoxHeight:169,
        maxHealth:200, 
        damage:10,
        proposedVelocity:5

    }, "Tank", tankImg, 1000],
    [{
        posx:sectorPosition.centerpos.x,
        posy:sectorPosition.centerpos.y,
        hBoxWidth:100, 
        hBoxHeight:169,
        maxHealth:50, 
        damage:20,
        proposedVelocity:10
    
    }, "GlassCannon", gcImg, 10000],
    [{
        posx:sectorPosition.centerpos.x,
        posy:sectorPosition.centerpos.y,
        hBoxWidth:100, 
        hBoxHeight:169,
        maxHealth:150, 
        damage:5,
        proposedVelocity:15
    
    }, "Thief", thiefImg, 20000]
]
//mnoje bi da stane 2-meren sas string za display?
//mai trqshe vs u da e otdelen klas i klas za kolekciqta da gi razpredeli
const upgradeTypes=[
    [new PlayerUpgrade(basePlayer.maxHealth/10, 0, 0, 0, 0), "Max HP"],
    [new PlayerUpgrade(0, basePlayer.damage/5, 0, 0, 0), "DMG"],
    [new PlayerUpgrade(0, 0, basePlayer.proposedVelocity/10, 0, 0), "Speed"],
    [new PlayerUpgrade(0, 0, 0, 0, basePlayer.maxHealth/5), "HP"]

];



const testUpgrade=new PlayerUpgrade(0, 0, 0, 0, 50);

let player=new Player(sectorPosition.centerpos.x, sectorPosition.centerpos.y, 100, 169, 100, 10, 10, normalImg);
let playerHPBar=new HealthBar(100, canvas.height-100, 400, 50);

let game=new Game(player,ctx);

game.startScreen();

//test
// let enemy=new Enemy(sectorPosition.centerpos.x-enemyPosition.hoffset, sectorPosition.centerpos.y-enemyPosition.voffset, 169, 200, 100, 10);

// //player.showHitBox(ctx);
// //player.velx=6;
// //player.vely=6;

// console.log(sectorPosition.targetPosition([false, true], true));
// //const startPos;
// document.addEventListener("keydown", onKeyPress, false);
// //

// function onKeyPress(event)
// {
//     //smenq na pravilnata poziciq s f-iq
//     if (player.recovery) return;
//     //tuk po-skoro trq se opravi da moje da se mesti m/u 2 i eventualno da spira
//     if (player.velx!==0||player.vely!==0) return;
//     switch (event.key)
//     {
//         // case 'w': {player.currentSector=[player.currentSector[0], (player.currentSector[0]||player.currentSector[1])&&!player.currentSector[0]]; player.velx=0; player.vely=-5;} break;
//         // case 'a': {player.currentSector=[player.currentSector[0], player.currentSector[0]||player.currentSector[1]]; player.velx=-5; player.vely=-1;} break;
//         // case 's': {player.currentSector=[(player.currentSector[0]||player.currentSector[1])&&player.currentSector[0], player.currentSector[0]||player.currentSector[1]];player.velx=0; player.vely=5;} break;
//         // case 'd': {player.currentSector=[(player.currentSector[0]&&player.currentSector[1])||(!player.currentSector[0]&&!player.currentSector[1]), player.currentSector[0]||player.currentSector[1]];player.velx=5; player.vely=-1;} break;
//         //case 'w': case 'a': case 's': case 'd': {if (event.shiftKey) setTimeout(()=>player.invincibility=true,100);}
        
//         //bullfuckingshit
//         case 'w': case 'W':{if (player.currentSector[0]&&player.currentSector[1]) {
//             if (!enemy.blocking) player.currentSector=sector.center;
//             player.velx=0; player.vely=-player.proposedVelocity;
//             if (event.shiftKey) setTimeout(()=>{player.invincibility=true; player.dodging=true;},100);}} break;
//         case 'a': case 'A':{if (player.currentSector[0]!==player.currentSector[1]){
//             player.currentSector[0]=!player.currentSector[0]; player.currentSector[1]=false; 
//             player.velx=-player.proposedVelocity; player.vely=player.proposedVelocity*(-1+2*(+player.currentSector[0]))*(sectorPosition.upperLaneVDiff/sectorPosition.hdiff);
//             if (event.shiftKey) setTimeout(()=>{player.invincibility=true; player.dodging=true;},100);}} break;
//         case 's': case 'S':{if (player.currentSector[0]&&!player.currentSector[1]){
//             player.currentSector=sector.lower;
//             player.velx=0; player.vely=player.proposedVelocity;
//             if (event.shiftKey) setTimeout(()=>{player.invincibility=true; player.dodging=true;},100);}} break;
//         case 'd': case 'D':{if (!(player.currentSector[0]&&player.currentSector[1])&&!player.currentSector[1]){
//             player.currentSector[0]=!player.currentSector[0]; player.currentSector[1]=(!player.currentSector[0]||player.currentSector[1]);
//             player.velx=player.proposedVelocity; player.vely=player.proposedVelocity*(-1+2*(+player.currentSector[0]))*(sectorPosition.upperLaneVDiff/sectorPosition.hdiff);
//             if (event.shiftKey) setTimeout(()=>{player.invincibility=true; player.dodging=true;},100);}} break;
//         case ' ': {if (player.velx==0&&player.vely==0) player.attack(ctx);} break;    
//         //case 'Shift': {player.invincibility=true;} break;    
//     }
//     //console.log(sectorPosition.targetPosition(player.currentSector, event.key!='w'));
// }
// //cringe
// console.log(player.currentSector);
// console.log(enemy.atkhBox);
// function animPMovement()
// {
//     if(player.health===0) return;
//     ctx.clearRect(0,0, canvas.width, canvas.height);
//     enemy.update(ctx, player);
//     player.update(ctx, enemy);
//     playerHPBar.update(ctx, player);
//     window.requestAnimationFrame(animPMovement);
// }
// animPMovement();

//window.setInterval(animPMovement,1);

