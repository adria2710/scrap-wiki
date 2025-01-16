const axios = require("axios")
const cheerio =  require("cheerio")
const { response } = require("express")
const express = require("express")
const app = express()

const url = 'https://es.wikipedia.org/wiki/Categor%C3%ADa:M%C3%BAsicos_de_rap'


app.get('/', (req, res) => {
    axios.get(url).then((response) => {
        if(response.status === 200) {
            const html = response.data
            /*console.log(html)*/
            const $ = cheerio.load(html)

            const pageTitle = $('title').text()

            const enlaces = []
            $('#mw-pages a').each((index, element) => {
                const enlace = $(element).attr('href')
                enlaces.push(enlace)
            })
            /*console.log(enlaces)*/
            const url2 = `https://es.wikipedia.org${enlaces}`
            const detalles = []
            for (const enlace of enlaces) {
                const respuesta2 = axios.get(enlace)
                const html2 = respuesta2.data
                const $pagina2 = cheerio.load(html2)
                const titulo = $pagina2("h1").text()
                const imagenes = []
                $pagina2("img").each((_, img) => {
                    const imgSrc = $pagina2(img).attr("src")
                    if(imgSrc){
                        imagenes.push(imgSrc.startsWith("http") ? imgSrc : `https:${imgSrc}`)
                    }
                })
                const textos = []
                $pagina2("p").each((_, p) => {
                    const texto = $pagina2(p).text().trim()
                    if(texto) texto.push(texto)
                })
            detalles.push({titulo, imagenes, textos})
            }

            res.send(`
                <h1>${pageTitle}</<h1>
                <h2>ENLACES</h2>
                <ul>
                ${detalles.map((detalle) => `<li>
                    <h3>${detalle.titulo}</h3>
                    <p>${detalle.textos.join("</p><p>")}</p>
                    <ul>${detalle.imagenes.map((img) => `<li><img src="${img}" alt="${detalle.titulo}" width="200"/></li>`).join("")}
                </ul>
            </li>
            `
            )
            .join("")}
        </ul>
                `)
        }
    })
})
app.listen (3000, () => {
    console.log("http://localhost:3000")
})

/*
axios.get(url2).then((response) =>  {
    const html2 = response.data
    console.log(pageTitle2)
    const pageTitle2 = $('title').text()
    
})*/



