export async function handler() {
  try {
    const response = await fetch(
      "http://restidm.runasp.net/api/GetKeys/NewKey",
    );
    const key = await response.text();

    return {
      statusCode: 200,
      body: key,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Error fetching key",
    };
  }
}
