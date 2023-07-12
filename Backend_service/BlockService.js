const axios = require("axios");
const querystringt = require("querystring");
const HTMLParser = require("node-html-parser");
const fs = require("fs");

function getCookie(headers) {
  const result = headers["set-cookie"].map((value) => {
    const sparate = value.replace(";", "").split(" ");
    return sparate[0];
  });
  return result;
}

function login() {
  const data = {
    session: "true",
    user_idp: "https://wtc.tu-chemnitz.de/shibboleth",
    Select: "",
  };
  const options = {
    headers: {
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Encoding": "gzip, deflate, br",
      "Accept-Language": "en-US,en;q=0.9",
      "Content-Type": "application/x-www-form-urlencoded",
    },
  };

  axios
    .get("https://www.tu-chemnitz.de/informatik/DVS/blocklist/", {
      maxRedirects: 0,
      validateStatus: (status) => status === 302,
    })
    .then((res) => {
      axios.get(res.headers.location).then((res2) => {
        const cookie = getCookie(res2.headers);
        axios
          .post(res.headers.location, querystringt.stringify(data), {
            headers: { ...options.headers, ...{ Cookie: cookie } },
            maxRedirects: 0,
            validateStatus: (status) => status === 302,
          })
          .then((res3) => {
            const make_Cookies = getCookie(res3.headers);

            axios
              .get(res3.headers.location, {
                maxRedirects: 0,
                validateStatus: (status) => status === 302,
              })
              .then((res4) => {
                const cookie2 = getCookie(res4.headers);
                axios
                  .get(res4.headers.location, {
                    headers: {
                      ...options.headers,
                      ...{ Cookie: make_Cookies.join("; ") },
                    },
                    validateStatus: (status) => status === 401,
                  })
                  .then((res5) => {
                    const root = HTMLParser.parse(res5.data);
                    const set_fshibid = getCookie(res5.headers);
                    axios
                      .get(root.querySelector("#redirect").attrs.href, {
                        headers: {
                          ...options.headers,
                          ...{
                            Cookie:
                              set_fshibid + "; " + make_Cookies.join("; "),
                          },
                        },
                        maxRedirects: 0,
                        validateStatus: (status) => status === 302,
                      })
                      .then((res6) => {
                        const header = {
                          ...options.headers,
                          ...{
                            Cookie:
                              set_fshibid + "; " + make_Cookies.join("; "),
                          },
                        };
                        axios
                          .get(res6.headers.location, {
                            headers: header,
                          })
                          .then((res7) => {
                            const rootHtml = HTMLParser.parse(res7.data);
                            const authState = rootHtml.querySelector(
                              'input[name="AuthState"]'
                            ).attributes["value"];
                            axios
                              .post(
                                "https://wtc.tu-chemnitz.de/krb/module.php/TUC/username.php",
                                querystringt.stringify({
                                  username: process.env.USER_NAME,
                                  AuthState: authState,
                                }),
                                {
                                  headers: header,
                                  maxRedirects: 0,
                                  validateStatus: (status) => status === 303,
                                }
                              )
                              .then((res8) => {
                                axios
                                  .get(res8.headers.location, {
                                    headers: header,
                                    maxRedirects: 0,
                                    validateStatus: (status) => status === 302,
                                  })
                                  .then((res9) => {
                                    axios
                                      .get(res9.headers.location, {
                                        headers: header,
                                      })
                                      .then((res10) => {
                                        const rootHtml2 = HTMLParser.parse(
                                          res10.data
                                        );
                                        const authState2 =
                                          rootHtml2.querySelector(
                                            'input[name="AuthState"]'
                                          ).attributes["value"];
                                        axios
                                          .post(
                                            "https://wtc.tu-chemnitz.de/krb/module.php/core/loginuserpass.php",
                                            querystringt.stringify({
                                              password:
                                                process.env.TUC_PASSWORD,
                                              AuthState: authState2,
                                            }),
                                            {
                                              headers: header,
                                            }
                                          )
                                          .then((res11) => {
                                            const lateData = HTMLParser.parse(
                                              res11.data
                                            )
                                              .querySelector(
                                                'form[method="post"]'
                                              )
                                              .childNodes.filter(
                                                (node) => node.rawAttributes
                                              )
                                              .filter(
                                                (value) =>
                                                  value.rawAttributes.hasOwnProperty(
                                                    "name"
                                                  ) &&
                                                  value.rawAttributes.hasOwnProperty(
                                                    "value"
                                                  )
                                              )
                                              .map((item) => {
                                                return {
                                                  name: item.rawAttributes.name,
                                                  value:
                                                    item.rawAttributes.value,
                                                };
                                              });
                                            const url2 = HTMLParser.parse(
                                              res11.data
                                            ).querySelector(
                                              'form[method="post"]'
                                            ).attributes["action"];

                                            const newCookies = getCookie(
                                              res11.headers
                                            );
                                            const authCookies =
                                              newCookies.find((ele) =>
                                                ele.includes(
                                                  "WTC_AUTHENTICATED"
                                                )
                                              ) +
                                              "; " +
                                              cookie2;
                                            axios
                                              .post(
                                                url2,
                                                querystringt.stringify({
                                                  SAMLResponse:
                                                    lateData[0].value,
                                                  RelayState: lateData[1].value,
                                                }),
                                                {
                                                  headers: {
                                                    ...options.headers,
                                                    ...{
                                                      Cookie: authCookies,
                                                    },
                                                  },
                                                  maxRedirects: 0,
                                                  validateStatus: (status) =>
                                                    status === 302,
                                                }
                                              )
                                              .then((res12) => {
                                                const getCookie4 = getCookie(
                                                  res12.headers
                                                );
                                                const cookie4 =
                                                  getCookie4.find((ele) =>
                                                    ele.includes(
                                                      "_shibsession_"
                                                    )
                                                  ) +
                                                  "; " +
                                                  newCookies.find((ele) =>
                                                    ele.includes(
                                                      "WTC_AUTHENTICATED"
                                                    )
                                                  ) +
                                                  "; " +
                                                  cookie2;
                                                const but = fs.readFileSync(
                                                  ".env",
                                                  "utf-8",
                                                  function (err, data) {
                                                    if (err) {
                                                      return console.log(err);
                                                    }

                                                    return data;
                                                  }
                                                );
                                                const save = but.replace(
                                                  `COOKIE = ${process.env.COOKIE}`,
                                                  `COOKIE = ${cookie4}`
                                                );

                                                fs.writeFile(
                                                  ".env",
                                                  save,
                                                  "utf8",
                                                  function (err) {
                                                    if (err)
                                                      return console.log(err);
                                                  }
                                                );
                                              });
                                          });
                                      });
                                  });
                              });
                          });
                      });
                  });
              });
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
}

module.exports.BlockAuth = login;

//expires=Thu, 13-Oct-2022 11:19:25
