// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  // BACKEND_HOST: 'http://be-arzkd-2.apps.ocp4three.namategroup.com',
  BACKEND_HOST: 'http://be-arzkd.apps.ocp4one.namategroup.com', // the one for the demo
  // BACKEND_HOST: 'http://localhost:8080',
  QUIZ_ANSWER_BTN_DEFAULT_COLOR: '#6155A1',
  BACKEND_STORYBOOK_ENDPOINT: '/api/v1/storybook',
  BACKEND_USER_ENDPOINT: '/api/v1/user',
  BACKEND_QUIZSESSION_ENDPOINT: '/api/v1/quizSession',
  BACKEND_QUIZ_ENDPOINT: '/api/v1/quiz',
  BACKEND_HOME_ENDPOINT: '/api/v1/home',
  BACKEND_STORYSESSION_ENDPOINT: '/api/v1/storySession',
  BACKEND_FORGOTPASSWORD_ENDPOINT: '/api/v1/forgotPassword',
  DEFAULT_AVATAR_DATA: '<svg xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:cc="http://creativecommons.org/ns#" xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:svg="http://www.w3.org/2000/svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 280 280" fill="none"><metadata><rdf:RDF><cc:Work><dc:format>image/svg+xml</dc:format><dc:type rdf:resource="http://purl.org/dc/dcmitype/StillImage"/><dc:title>Avataaars</dc:title><dc:creator><cc:Agent><dc:title>Pablo Stanley</dc:title></cc:Agent></dc:creator><dc:source>https://avataaars.com/</dc:source><cc:license rdf:resource="https://avataaars.com/"/><dc:contributor><cc:Agent><dc:title>Florian Körner</dc:title></cc:Agent></dc:contributor></cc:Work></rdf:RDF></metadata><mask id="avatarsRadiusMask"><rect width="280" height="280" rx="0" ry="0" x="0" y="0" fill="#fff"/></mask><g mask="url(#avatarsRadiusMask)"><g transform="translate(40, 36)"><path d="M100 0C69.072 0 44 25.072 44 56v6.166c-5.675.952-10 5.888-10 11.834v14c0 6.052 4.48 11.058 10.305 11.881 2.067 19.806 14.458 36.541 31.695 44.73V163h-4c-39.764 0-72 32.236-72 72v9h200v-9c0-39.764-32.236-72-72-72h-4v-18.389c17.237-8.189 29.628-24.924 31.695-44.73C161.52 99.058 166 94.052 166 88V74c0-5.946-4.325-10.882-10-11.834V56c0-30.928-25.072-56-56-56z" fill="#FFDBB4"/><path d="M76 144.611v8A55.79 55.79 0 00100 158a55.789 55.789 0 0024-5.389v-8A55.789 55.789 0 01100 150a55.79 55.79 0 01-24-5.389z" fill="#000" fill-opacity=".1"/></g><g transform="translate(8, 170)"><path d="M100.374 29.141c1.88-2.864 4.479-5.43 7.626-7.57v15.306c0 5.823 3.978 10.976 10.078 14.118l-.078.062.909 2.865c3.878 1.994 8.341 3.13 13.091 3.13s9.213-1.136 13.091-3.13l.909-2.865-.078-.062C152.022 47.853 156 42.7 156 36.877V22.279c2.684 1.979 4.923 4.28 6.597 6.819C201.159 30.465 232 62.157 232 101.052V110H32v-8.948c0-38.549 30.294-70.022 68.374-71.91z" fill="#A7FFC4"/><path d="M108 21.572c-6.767 4.602-11 11.168-11 18.456 0 7.398 4.362 14.052 11.308 18.664l6.113-4.816 4.579.332-1-3.151.078-.062C111.978 47.853 108 42.7 108 36.877V21.57zm48 15.305c0 5.823-3.978 10.976-10.078 14.118l.078.062-1 3.15 4.579-.33 5.65 4.45C161.863 53.733 166 47.234 166 40.027c0-6.921-3.818-13.192-10-17.748v14.598z" fill="#fff" fill-opacity=".75"/></g><g transform="translate(86, 134)"><path fill-rule="evenodd" clip-rule="evenodd" d="M35.118 15.128C36.176 24.62 44.226 32 54 32c9.804 0 17.874-7.426 18.892-16.96.082-.767-.775-2.04-1.85-2.04H37.088c-1.08 0-2.075 1.178-1.97 2.128z" fill="#000" fill-opacity=".7"/><path d="M70 13H39a5 5 0 005 5h21a5 5 0 005-5z" fill="#fff"/><path d="M66.694 27.138A10.964 10.964 0 0059 24c-1.8 0-3.5.433-5 1.2-1.5-.767-3.2-1.2-5-1.2-2.995 0-5.71 1.197-7.693 3.138A18.93 18.93 0 0054 32c4.88 0 9.329-1.84 12.694-4.862z" fill="#FF4F6D"/></g><g transform="translate(112, 122)"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 8c0 4.418 5.373 8 12 8s12-3.582 12-8" fill="#000" fill-opacity=".16"/></g><g transform="translate(84, 90)"><path d="M36 22a6 6 0 11-12 0 6 6 0 0112 0zm52 0a6 6 0 11-12 0 6 6 0 0112 0z" fill="#000" fill-opacity=".6"/></g><g transform="translate(84, 82)"><path d="M15.63 17.159c3.915-5.51 14.648-8.598 23.893-6.328a2 2 0 10.954-3.884C29.74 4.31 17.312 7.887 12.37 14.84a2 2 0 103.26 2.318zm80.74 0c-3.915-5.51-14.648-8.598-23.893-6.328a2 2 0 11-.954-3.884c10.737-2.637 23.165.94 28.108 7.894a2 2 0 01-3.26 2.318z" fill="#000" fill-opacity=".6"/></g><g transform="translate(7, 0)"><path d="M187.709 56.124c.892 3.247 2.163 11.95-.072 14.833-.746.962-5.841-1.74-7.966-2.913-1.243-.687-2.415-1.34-3.532-1.963-14.915-8.316-19.735-11.004-45.893-10.623-28.116.409-47.379 13.582-48.462 14.93-.754.937-1.716 3.44-2.508 10.412-.25 2.208-.32 4.97-.39 7.713-.15 5.922-.298 11.76-2.255 11.75-2.44-.013-2.97-23.786-1.917-33.217.04-.352.106-.773.178-1.226.223-1.407.496-3.129.155-4.114-.153-.444-.54-.714-.937-.991-.62-.434-1.265-.884-1.077-2.04.212-1.305 1.092-1.429 1.964-1.551.569-.08 1.135-.16 1.509-.567 1.128-1.228.453-1.867-.318-2.597-.455-.431-.944-.894-1.115-1.53-.634-2.36 1.024-3.094 2.687-3.83l.38-.169c.687-.31 1.103-.416 1.42-.498.593-.152.848-.217 1.886-1.348-2.131-1.563-2.902-3.691.016-4.833.56-.219 1.522-.208 2.5-.198 1.19.013 2.403.026 2.936-.374.148-.111.244-.53.33-.904.06-.264.115-.506.18-.598 1.35-1.931 1.234-3.399 1.078-5.39a59.637 59.637 0 01-.068-.926c-.129-2.038-.112-3.909 2.329-4.112 1.004-.084 1.894.39 2.77.858.544.29 1.083.578 1.641.728.875.235 1.1.435 1.321.432.189-.002.375-.152.958-.553 1.187-.818 1.31-2.05 1.434-3.29.11-1.087.219-2.181 1.042-3.013 1.576-1.59 2.798-.63 3.996.31.643.505 1.28 1.005 1.96 1.1 2.546.355 3.064-1.063 3.622-2.59.367-1.005.752-2.058 1.745-2.681 1.829-1.15 2.647-.048 3.434 1.013.499.672.985 1.327 1.709 1.384 1.004.079 2.506-1.093 3.839-2.133.814-.636 1.565-1.221 2.099-1.442 2.269-.936 3.917.064 5.585 1.077 1.408.855 2.83 1.718 4.652 1.434.298-.046.573-.091.831-.134 2.238-.37 3.107-.513 5.446.962 1.69 1.065 2.52.91 3.738.683.606-.113 1.308-.244 2.26-.251 1.111-.009 1.986.497 2.829.984.693.4 1.365.79 2.13.869.423.044.837-.155 1.259-.357.42-.202.848-.407 1.301-.38 1.827.111 2.688 1.493 3.554 2.884.668 1.072 1.339 2.15 2.46 2.652 1.619.726 3.436.248 5.171-.208.783-.206 1.549-.408 2.274-.493 3.959-.464 3.277 1.968 2.549 4.56-.318 1.132-.644 2.295-.595 3.26 1.148.268 2.305-.153 3.46-.573 1.092-.397 2.183-.794 3.264-.607 3.398.586 2.254 4.021 1.442 6.46l-.074.22c.635-.012 1.538-.205 2.552-.422 2.863-.611 6.619-1.414 7.78 1.129.479 1.051.014 2.31-.44 3.537-.313.847-.62 1.678-.607 2.415.026 1.527.71 2.896 1.396 4.267.455.91.912 1.823 1.175 2.783z" fill="#2C1B18"/><path d="M186.361 73.608c.254.176.427.296.471.32 1.757.99 3.148 10.9 3.216 14.69.042 2.338.079 11.256-2.394 10.485-.753-.235-1.902-4.956-2.066-7.719-.163-2.763-1.733-12.164-4.141-16.49a11.833 11.833 0 00-.526-.814c-.649-.952-1.437-2.109-.919-2.745.722-.887 1.426-.575 2.259-.207.142.062.287.126.436.187.868.35 2.771 1.672 3.664 2.293z" fill="#2C1B18"/></g></g></svg>'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.