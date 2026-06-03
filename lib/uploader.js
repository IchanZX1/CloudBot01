let axios = require('axios')
let BodyForm = require('form-data')
let { fromBuffer } = require('file-type')
let fetch = require('node-fetch')
let fs = require('fs')
let path = require('path')
let cheerio = require('cheerio')
const { ImageUploadService } = require('node-upload-images')

async function TmpFiles(input, filename = `tmp_${Date.now()}.jpg`) {
	return new Promise(async (resolve, reject) => {
		try {
			const form = new BodyForm()
			if (Buffer.isBuffer(input)) {
				form.append('file', input, filename)
			} else {
				form.append('file', fs.createReadStream(input))
			}

			const { data } = await axios({
				url: 'https://tmpfiles.org/api/v1/upload',
				method: 'POST',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36',
					...form.getHeaders()
				},
				data: form
			})

			if (data?.status !== 'success' || !data?.data?.url) {
				return reject(new Error('TmpFiles upload failed'))
			}

			resolve(data.data.url)
		} catch (err) {
			reject(err)
		}
	})
}

async function TelegraPh(media) {
	return new Promise(async (resolve, reject) => {
		try {
			// Simpan sementara
			//let tmpFile = path.join(__dirname, `temp_${Date.now()}.jpg`)
			let tmpFile = media
			//fs.writeFileSync(tmpFile, media)

			// Upload ke pixhost.to
			const service = new ImageUploadService('pixhost.to')
			let { directLink } = await service.uploadFromBinary(fs.readFileSync(tmpFile), `temp_${Date.now()}.jpg`)

			// Hapus file setelah upload
			fs.unlinkSync(tmpFile)
			return resolve(directLink)
		} catch (err) {
			return reject(new Error(String(err)))
		}
	})
}

async function UploadFileUgu(input) {
	return new Promise(async (resolve, reject) => {
		const form = new BodyForm();
		form.append("files[]", fs.createReadStream(input))
		await axios({
			url: "https://uguu.se/upload.php",
			method: "POST",
			headers: {
				"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.212 Safari/537.36",
				...form.getHeaders()
			},
			data: form
		}).then((data) => {
			resolve(data.data.files[0])
		}).catch((err) => reject(err))
	})
}

function webp2mp4File(path) {
	return new Promise((resolve, reject) => {
		const form = new BodyForm()
		form.append('new-image-url', '')
		form.append('new-image', fs.createReadStream(path))
		axios({
			method: 'post',
			url: 'https://s6.ezgif.com/webp-to-mp4',
			data: form,
			headers: {
				'Content-Type': `multipart/form-data; boundary=${form._boundary}`
			}
		}).then(({ data }) => {
			const bodyFormThen = new BodyForm()
			const $ = cheerio.load(data)
			const file = $('input[name="file"]').attr('value')
			bodyFormThen.append('file', file)
			bodyFormThen.append('convert', "Convert WebP to MP4!")
			axios({
				method: 'post',
				url: 'https://ezgif.com/webp-to-mp4/' + file,
				data: bodyFormThen,
				headers: {
					'Content-Type': `multipart/form-data; boundary=${bodyFormThen._boundary}`
				}
			}).then(({ data }) => {
				const $ = cheerio.load(data)
				const result = 'https:' + $('div#output > p.outfile > video > source').attr('src')
				resolve({
					status: true,
					message: "Xeorz",
					result: result
				})
			}).catch(reject)
		}).catch(reject)
	})
}

async function floNime(medianya, options = {}) {
	const { ext } = await fromBuffer(medianya) || options.ext
	var form = new BodyForm()
	form.append('file', medianya, 'tmp.' + ext)
	let jsonnya = await fetch('https://flonime.my.id/upload', {
		method: 'POST',
		body: form
	})
		.then((response) => response.json())
	return jsonnya
}

module.exports = { TmpFiles, TelegraPh, UploadFileUgu, webp2mp4File, floNime }
