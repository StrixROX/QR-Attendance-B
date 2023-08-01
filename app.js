const express = require("express")
const path = require("path")
const qr = require("qr-image")
const fs = require("fs")
const fileupload = require("express-fileupload")
const qrCode = require("qrcode-reader")

const port = 3504
const uuid = fs.readFileSync("secret.dat", {
  encoding: "utf-8",
  flag: "r",
})

const app = express()
app.use(fileupload())

app.get("/", (req, res) => {
  res.status(200).sendFile(path.join(__dirname, "/pages/index.html"))
})

app.get("/public-qr", async (req, res) => {
  qrcode = await qr.image(`http://${req.headers.host}/mark-attendance/${uuid}`)
  qrcode.pipe(res)
})

app.get("/mark-attendance/:uuid", (req, res) => {
  console.log(req.socket.remoteAddress)
  console.log(req.headers)
  const _uuid = req.params.uuid
  if (_uuid === uuid) {
    res.status(200).sendFile(path.join(__dirname, "/pages/upload.html"))
  } else {
    res.status(400).send("<h1><i>Error 400: Bad URL</i></h1>")
  }
})

app.post("/process", (req, res) => {
  // console.log(req.socket.remoteAddress)
  // console.log(req.socket.localAddress)
  if (req.files["qr-upload"] != null) {
    console.log(req.files["qr-upload"])
    const qr = new qrCode()
    qr.callback = function (err, res) {
      if (err) {
        console.log(err)
        res.status(400).send("<h1>Bad QR</h1>")
        return
      }
      console.log(res)
      res.status(200).send("<h1>OK</h1>")
    }
    qr.decode(req.files["qr-upload"].data)
  }
})

app.listen(port, () => console.log(`Listening at port ${port}...`))

function uploadHandler() {}
