const fs = require('graceful-fs')

const first = "pm>*rgOvtWYX4suD2a5T#o1!l^Lhy0z<9fk\\QAEwKn)x3cVi&SHG7;|]UejIdq(PRCBZ8b6FMN"
const second = "aK|SFlDk3>LP29ZR<470W6]HwuzdByQMU8tCo^cf!vq&*ixn5bp(#N;mGVOIjXE)YAhs\\egT1r"
const third = "piuvQy9fTs1qMK6EGbSde<\\;25AFc|&mXa^LYljr3N*ZUwxz4IW])O>nCR7#Pgh0BoVt8!D(Hk"
const fourth = "!9FR*GloeOSEx4hAu0T^c8MvZ#IgrH(w7K|]PnCatbWBLysmkUj\\&iD>)65qfV12YNp3d<zXQ;"
const fifth = "*induoeI>HgvDyKRYclsqrx6#WEz!Bm<7w^V(AO&S9NabM2k\\C|3X0;4GZ8Pp1Lj]htQT)fUF5"
const sixth = "aClw6uy>V2Y;g)Svjs0qD&G|TK#Itfn9*]U1Oo8Qm(khRiBZ5Wbcxz!XpdF^e7PA3HLNME<4r\\"
const decimals = [first, second, third, fourth, fifth, sixth]
let places = []
let sketchyPhrases = ["DRIVEBYDOWNLOADS.ENABLED",
    "FACEBOOK.TRACKING.ENBLED",
    "GOOGLE.LOCATIONDATA.TRUE",
    "NSA.YES",
    "WHEREISSNOWDEN.IDK",
    'IFFBITRACKING.TRUE',
    'IPDETECTED',
    'WATCHLISTUPDATED',
    'ENCRYPTION.NAH',
    'SECURITY.WHAT',
    'SECURITY.NO',
    'FALSESENSEOFSECURITY.ENABLED',
    'ANTIMALWARE.DISABLED',
    'TRACKINGCOUNTRY.CHINA',
    'SENDINGPACKAGE.LOCATION.WOHAN',
    'VIRUSDETECTED.ADDINGTOHOSTSYSTEM',
    'VIRUS.COVID19.ENABLED',
    'YOUWILLNEVERFINDUS.TRUE',
    'USERISIDIOT.TRUE',
    'ILLUMINATI.INJECTED',
    'ILLUMINATI.CONFIRMED',
    'ITSTOOLATEFORYOU',
    'ATFMAN.LISTENING.TRUE',
    'CIA.AGENT.STATUS.COMING',
    'NSA.AGENT.STATUS.COMING',
    'FBI.AGENT.STATUS.COMING',
    'MI6.AGENT.STATUS.COMING',
    'DISSA.AGENT.STATUS.COMING',
    'DARPA.BULLET.STATUS.FIRED',
    'CANYOUSTOPME.NO',
    'DARKWEBREDIRECT.TRUE',
    'TOR.STATUS.STARTING',
    'THESITEYOUWANTED.FALSE',
    'PEBCAK.TRUE',
    'RM-RF/.DOIT',
    'SYSTEM32.STATUS.GONE']

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

fs.readFile('./places.csv', (err, data) => {
    if (err) {
        console.error(err)
        return
    }
    places = data.toString().split(",")
    console.log(places)
})

exports.next = () => {
    let s = ""
    places[0]++
    for (let i = 0; i < 6; i++)
        if (places[i] === 73) {
            places[i + 1]++
            places[i] = 0
        }
    for (let i = 0; i < 6; i++) s += decimals[i].substring(places[i], places[i] + 1)
    fs.writeFile('./places.csv', places.toString(), err => {
        if (err) console.error(err)
    })
    return s.substr(0, 6)
};

exports.lonk = () => {
    let result = '';
    let characters = '0123456789aAbBcCdDeEfFgGhHiIjkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
    let charactersLength = characters.length;
    for (let i = 0; i < 2048; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

exports.sketchy = () => {
    let result = '';
    let characters = '0123456789aAbBcCdDeEfFgGhHiIjkKlLmMnNoOpPqQrRsStTuUvVwWxXyYzZ';
    let charactersLength = characters.length;
    for (let i = 0; i < 3; i++) {
        for (let i = 0; i < 24; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        result += sketchyPhrases[getRandomInt(result.length)]
    }
    return result;
};

// module.exports.next = next()

