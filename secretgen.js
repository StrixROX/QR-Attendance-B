const { v4: uuidv4 } = require("uuid")
const fs = require("fs")

const uuid = uuidv4()
fs.writeFileSync("secret.dat", uuid, { encoding: "utf-8", flag: "w" })
