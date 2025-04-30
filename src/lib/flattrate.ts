// const baseUrl = "";

export async function searchSymbol(text: string, id: string, token: string) {
  try {
    const response = await fetch(
      "https://piconnect.flattrade.in/PiConnectTP/SearchScrip",
      {
        headers: { "Content-Type": "text/plain" },
        method: "POST",
        body: `jData=${JSON.stringify({ uid: id, stext: text })}&jKey=${token}`,
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("error on search symbol", error);
  }
}

export async function getQuote(stoken: string, id: string, token: string) {
  try {
    const response = await fetch(
      "https://piconnect.flattrade.in/PiConnectTP/GetQuotes",
      {
        headers: { "Content-Type": "text/plain" },
        method: "POST",
        body: `jData=${JSON.stringify({
          uid: id,
          exch: "NSE",
          token: stoken,
        })}&jKey=${token}`,
      }
    );
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    console.log("error on search symbol", error);
  }
}
