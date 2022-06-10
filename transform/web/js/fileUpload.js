/* 大文件上传 */
const upload = document.querySelector("#upload7")
const upload_inp = upload.querySelector(".upload_inp")
const upload_button_select = upload.querySelector(".upload_button.select")
const upload_progress = upload.querySelector(".upload_progress")
const upload_progress_value = upload_progress.querySelector(".value")

upload_button_select.addEventListener("click", function () {
  if (checkIsDisable(this)) return
  upload_inp.click()
})

upload_inp.addEventListener("change", async function () {
  const file = upload_inp.files[0] // 获取上传的文件对象
  if (!file) {
    return
  }
  // add()

  handleUpload1(file)

  // const { hash, suffix } = await changeBuffer(file) // 获取文件的HASH
  // const already = await alreadyUpload(hash) // 获取已经上传的切片信息
  // const { chunks, count } = fileSplice(file, hash, suffix) // 将文件切片

  // // 把每一个切片都上传到服务器上
  // chunks.forEach((chunk, index) => {
  //   // 已经上传的无需在上传
  //   if (already.length > 0 && already.includes(chunk.filename)) {
  //     complate(index, hash, count)
  //     return
  //   }
  //   const fm = new FormData()
  //   fm.append("file", chunk.file)
  //   fm.append("filename", chunk.filename)
  //   instance
  //     .post("/upload_chunk", fm)
  //     .then(data => {
  //       if (+data.code === 0) {
  //         complate(index, hash, count)
  //         return
  //       }
  //       return Promise.reject(data.codeText)
  //     })
  //     .catch(() => {
  //       alert("当前切片上传失败，请您稍后再试~~")
  //       clear()
  //     })
  // })
})

// 上传成功的处理
async function complate(index, hash, count) {
  // 管控进度条
  index++
  upload_progress_value.style.width = `${(index / count) * 100}%`

  // 当所有切片都上传成功，我们合并切片
  if (index < count) return
  upload_progress_value.style.width = `100%`
  try {
    const data = await instance.post(
      "/upload_merge",
      { hash, count },
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    )
    if (+data.code === 0) {
      alert(`恭喜您，文件上传成功，您可以基于 ${data.servicePath} 访问该文件~~`)
      clear()
      return
    }
    throw data.codeText
  } catch (err) {
    alert("切片合并失败，请您稍后再试~~")
    clear()
  }
}

function checkIsDisable(element) {
  return element.classList.contains("disable") || element.classList.contains("loading")
}

function changeBuffer(file) {
  return new Promise((resolve, reject) => {
    const spark = new SparkMD5.ArrayBuffer()
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = e => {
      const buffer = e.target.result
      spark.append(buffer)
      const hash = spark.end()
      const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
      resolve({ hash, suffix })
    }
  })
}

function add() {
  upload_button_select.classList.add("loading")
  upload_progress.style.display = "block"
}

function clear() {
  upload_button_select.classList.remove("loading")
  upload_progress.style.display = "none"
  upload_progress_value.style.width = "0%"
}
// 获取已经上传的切片信息
async function alreadyUpload(hash) {
  const res = await instance.get("/upload_already", { params: { hash } })
  if (+res.code === 0) {
    return res.fileList
  }
}

function fileSplice(file, hash, suffix) {
  // 实现文件切片处理 「固定数量 & 固定大小」
  let max = 1024 * 100
  let count = Math.ceil(file.size / max)
  let index = 0
  const chunks = []
  if (count > 100) {
    max = file.size / 100
    count = 100
  }
  while (index < count) {
    chunks.push({
      file: file.slice(index * max, (index + 1) * max),
      filename: `${hash}_${index + 1}.${suffix}`,
    })
    index++
  }
  return { chunks, count }
}

/**
 * 抽样计算hash值 大概是1G文件花费1S的时间
 *
 * 采用抽样hash的方式来计算hash
 * 我们在计算hash的时候，将超大文件以2M进行分割获得到另一个chunks数组，
 * 第一个元素(chunks[0])和最后一个元素(chunks[-1])我们全要了
 * 其他的元素(chunks[1,2,3,4....])我们再次进行一个分割，这个时候的分割是一个超小的大小比如2kb，我们取* 每一个元素的头部，尾部，中间的2kb。
 *  最终将它们组成一个新的文件，我们全量计算这个新的文件的hash值。
 * @param file {File}
 * @returns
 */
function calcHashSample(file) {
  return new Promise(resolve => {
    const spark = new SparkMD5.ArrayBuffer()
    const reader = new FileReader()
    const size = file.size
    let offset = 2 * 1024 * 1024
    let chunks = [file.slice(0, offset)]
    // 前面2mb的数据
    let cur = offset
    while (cur < size) {
      // 最后一块全部加进来
      if (cur + offset >= size) {
        chunks.push(file.slice(cur, cur + offset))
      } else {
        // 中间的 前中后去两个字节
        const mid = cur + offset / 2
        const end = cur + offset
        chunks.push(file.slice(cur, cur + 2))
        chunks.push(file.slice(mid, mid + 2))
        chunks.push(file.slice(end - 2, end))
      }
      // 前取两个字节
      cur += offset
    }
    // 拼接
    reader.readAsArrayBuffer(new Blob(chunks))
    // 最后100K
    reader.onload = e => {
      spark.append(e.target.result)
      resolve({ hash: spark.end(), progress: 100 })
    }
  })
}

const handleUpload1 = async file => {
  if (!file) return
  const fileSize = file.size
  let offset = 2 * 1024 * 1024
  let cur = 0
  let count = 0
  // 每一刻的大小需要保存起来，方便后台合并
  const chunksSize = [0, 2 * 1024 * 1024]
  const { hash } = await calcHashSample(file)
  const suffix = /\.([a-zA-Z0-9]+)$/.exec(file.name)[1]
  //todo 判断文件是否存在存在则不需要上传，也就是秒传
  while (cur < fileSize) {
    const chunk = file.slice(cur, cur + offset)
    cur += offset
    const chunkName = `${hash}_${count + 1}.${suffix}`
    const form = new FormData()
    form.append("file", chunk)
    form.append("filename", chunkName)
    let start = new Date().getTime()
    // todo 上传单个碎片
    await instance.post("/upload_chunk", form)
    const now = new Date().getTime()
    const time = ((now - start) / 1000).toFixed(4)
    let rate = Number(time) / 10
    // 速率有最大和最小 可以考虑更平滑的过滤 比如1/tan
    if (rate < 0.5) rate = 0.5
    if (rate > 2) rate = 2
    offset = parseInt((offset / rate).toString())
    chunksSize.push(offset)
    count++
  }

  //todo 可以发送合并操作了
}
