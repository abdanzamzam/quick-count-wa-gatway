const qrcode = require("qrcode-terminal");
const { Client, LocalAuth } = require("whatsapp-web.js");

// Model
const { QuickCount } = require("../../models");

const client = new Client({
  authStrategy: new LocalAuth({ clientId: "client-one" })
});

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
  console.log("Client is ready!");
});

client.on("message", (message) => {
  const body = message.body;

  if (body.toLowerCase() === "halo" || body.toLowerCase() === "h") {
    const response =
      "Halo, silahkan pilih perintah dibawah ini:\n\nh : tampilkan menu\nt : tampilkan format report\nv (TPS) : tampikan data TPS\n\nTerimakasih 🙂";

    client.sendMessage(message.from, response);
  }

  if (body.toLowerCase() === "t") {
    const response =
      "TPS01\nGerindra:0\nPDIP:0\nGolkar:0\nPKS:0\nPAN:0\nDemokrat:0";

    client.sendMessage(message.from, response);
  }

  if (
    body.split(" ")[0].toLowerCase() === "v" &&
    body.split(" ")[1].toUpperCase().includes("TPS")
  ) {
    let response = "";
    const data = body.split(" ")[1];

    async function handleGet() {
      try {
        const result = await QuickCount.findAll({
          where: {
            tps: data
          }
        });

        if (result.length > 0) {
          await Promise.all(
            result.map(async (val, index) => {
              if (index === 0) {
                response += `Data quick count '${val.tps}'\n`;
                response += `\n${val.partai} : ${val.suara}`;
              } else {
                response += `\n${val.partai} : ${val.suara}`;
              }
            })
          );
        } else {
          client.sendMessage(
            message.from,
            `Upps, kode TPS (${data}) tidak ditemukan.`
          );
        }

        client.sendMessage(message.from, response);
      } catch (error) {
        client.sendMessage(
          message.from,
          "Upps, sepertinya ada kesalahan. Pastikan format benar ya"
        );
        client.sendMessage(
          message.from,
          "Gunakna v (TPS) untuk melihat detail data TPS"
        );
      }
    }

    handleGet();
  } else if (body.split("\n")[0].toUpperCase().includes("TPS")) {
    let payload = [];
    let tps;

    const data = body.split("\n");

    // Mapping Data
    data.map((val, index) => {
      if (index > 0) {
        payload.push({
          tps: tps,
          partai: val.split(":")[0],
          suara: val.split(":")[1]
        });
      } else {
        tps = val;
      }
    });

    async function handleSave() {
      try {
        await Promise.all(
          payload.map(async (val, index) => {
            const result = await QuickCount.findOne({
              where: {
                tps: val.tps,
                partai: val.partai
              }
            });

            if (result) {
              // data already exists
              const data = await QuickCount.update(
                {
                  suara: val.suara
                },
                {
                  where: {
                    tps: val.tps,
                    partai: val.partai
                  }
                }
              );
            } else {
              // create data
              const data = await QuickCount.create({
                tps: val.tps,
                partai: val.partai,
                suara: val.suara
              });
            }
          })
        );

        return true;
      } catch (error) {
        return false;
      }
    }

    const save = handleSave();

    if (save) {
      client.sendMessage(message.from, "Data berhasil disimpan! 🙂");
      client.sendMessage(
        message.from,
        "Silahkan kirimkan format + data terbaru untuk mengupdate data (jika dibutuhkan). Terimakasih..."
      );
    } else {
      client.sendMessage(
        message.from,
        "Upps, sepertinya ada kesalahan. Pastikan format sesuai template ya, boleh ulangi kembali 🙂"
      );
      client.sendMessage(
        message.from,
        "Ketikan 't' kemudian kirim untuk melihat format template"
      );
    }
  }
});

module.exports = client;
