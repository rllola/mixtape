
function getUserAddressFromDirectory (directoryPath) {
  return directoryPath.split('/')[2]
}

export { getUserAddressFromDirectory }
