const readInputFile = module.exports.readInputFile = file => {
  return new Promise((res, rej) => {
    const reader = new FileReader
    reader.readAsArrayBuffer(file)
    reader.onerror = () => rej(reader.error)
    reader.onload = () => res(reader.result)
  })
}