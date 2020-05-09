const fs = require('fs')

const first = "pm>*rgOvtWYX4suD2a5T#o1!l^Lhy0z<9f%k\\QAEwKn)x3cVi&SHG7;|]Ue{jIdq(PRCBZ8b6FMN}"
const second = "aK|SFlDk3>LP2%9ZR<470W6]HwuzdByQM}U8tC{o^cf!vq&*ixn5bp(#N;mGVOIjXE)YAhs\\egT1r"
const third = "p{iuvQy9fTs1qMK6EGbSde<\\;25AFc|&mXa^LYljr3N*ZUwxz4%IW])O>nCR7#Pgh0B}oVt8!D(Hk"
const fourth = "!9F{R}*GloeOSEx4hAu0T^c8MvZ#IgrH(w7K|]%PnCatbWBLysmkUj\\&iD>)65qfV12YNp3d<zXQ;"
const fifth = "*induo{eI>HgvDy}KRYclsqrx6#WEz!Bm<7w^V(AO&S9NabM2k\\C|3X0;%4GZ8Pp1Lj]htQT)fUF5"
const sixth = "aClw6uy>V2Y;g)Svjs0q{D&G|TK#Itf}n9*]U1Oo8Qm(khRiBZ5Wb%cxz!XpdF^e7PA3HLNME<4r\\"
const decimals = [first, second, third, fourth, fifth, sixth]
let places = []

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
        if (places[i] === 76) {
            places[i + 1]++
            places[i] = 0
        }
    for (let i = 0; i < 6; i++) s += decimals[i].substring(places[i], places[i] + 1)
    fs.writeFile('./places.csv', places.toString(), err => {
        if (err) console.error(err)
    })

    return s.substr(0,6)
};

// module.exports.next = next()

