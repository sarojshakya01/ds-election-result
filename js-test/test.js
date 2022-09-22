const fse = require("fs-extra")
const path = require("path")
const file = path.join(__dirname, "data.json")
const results = fse.readFileSync(file, "utf-8")

const filedis = path.join(__dirname, "districts.json")
const districts = JSON.parse(fse.readFileSync(filedis, "utf-8"))


JSON.parse(results).data[0].federal.provinces.forEach(p => {
    p.districts.forEach((d, i) => {
        const reg = d.regions.map(r => ({ id: r.id, type: "federal" }))
        let proReg = [];
        reg.forEach(r => {
            let fr1 = { ...r }
            fr1.type = "provincial"
            fr1.id = r.id + 0.1
            let fr2 = { ...r }
            fr2.type = "provincial"
            fr2.id = r.id + 0.2
            proReg.push(fr1)
            proReg.push(fr2)
        })
        let dist = districts.provinces.find(pd => pd.id == p.id).districts.find(dd => dd.id == d.id)
        dist["regions"] = [...reg, ...proReg]

    })
})
fse.writeFileSync("distnew.json", JSON.stringify(districts))