var CLIENT_ID = '1019583660017-vrumapuli7mbk9p0tf9k5f930ml9id83.apps.googleusercontent.com';

var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];

var SCOPES = [
  'https://www.googleapis.com/auth/drive.readonly',
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.appdata',
  'https://www.googleapis.com/auth/drive.install'
];
SCOPES = SCOPES.join(' ');

function handleClientLoad() {
  gapi.load('client:auth2:picker', () => {
    gapi.client.init({
      discoveryDocs: DISCOVERY_DOCS,
      clientId: CLIENT_ID,
      scope: SCOPES
    }).then(
      () => { vm.gapiLoaded = true; }, 
      (error) => { console.error(error); }
    )
  });
}