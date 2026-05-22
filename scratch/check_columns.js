const url = "https://vzwjdbpwcpsrdwndijvx.supabase.co/rest/v1/";
const key = "sb_publishable_e3Stz5P53B0xCQlvY65RUg_z5xkq8tx";

async function run() {
  try {
    const res = await fetch(url, {
      headers: {
        "apikey": key,
        "Authorization": `Bearer ${key}`
      }
    });
    const schema = await res.json();
    console.log("Response:", schema);
  } catch (e) {
    console.error("Error:", e);
  }
}

run();
