cd C:\dev-nmt\190406NMTARBFNT\2101arbrzkd\frontend

# for the font-awesome for the icong open book : <i class="fas fa-book-open"></i>
# https://www.angularjswiki.com/fontawesome/fa-book-open/
# https://github.com/FortAwesome/angular-fontawesome
ng add @fortawesome/angular-fontawesome@0.8.x

npm run start

#Install nodeshift
npm install -g nodeshift

#Log to OCP using nodeshift
nodeshift login --token=sha256~_vZmy2zUEItQf_2vdgC-AcCbRTKNXyZ2miLZTr11v5A --server=https://api.ocp4three.namategroup.com:6443 --insecure

#Deploy to OCP using dockerImage
npx nodeshift --dockerImage=kbnamate/angular-app --imageTag=1.0 --build.env OUTPUT_DIR=dist/uploadStory --namespace.name arzkd --expose

#deploy to ocp without dockerImage
OCP3
npx nodeshift --build.env OUTPUT_DIR=dist/uploadStory --namespace.name arzkd-2 --expose
OCP1
npx nodeshift --build.env OUTPUT_DIR=dist/uploadStory --namespace.name arzkd --expose
---
oc adm policy add-scc-to-user anyuid -z default -n arzkd

ng serve --host 0.0.0.0 -- port 8080 --disable-host-check

ng serve --live-reload false

