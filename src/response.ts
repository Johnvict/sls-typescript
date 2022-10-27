export function send(statusCode: number, data) {
  return {
    statusCode,
    body: JSON.stringify(data),
  };
}

export function error(error) {
  return {
    statusCode: 500,
    body: JSON.stringify({ status: "02", message: error.message }),
  };
}
