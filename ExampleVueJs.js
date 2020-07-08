        created() {
            this.loadingSatellits()
            this.loadingAntenna()
        },
        mounted() {
            clock();
        },

        watch: {
            spectrogramSettingsPosition: function () {
                this.correctionSpectrogram("position")
            },
            spectrogramSettingsScale: function () {
                this.correctionSpectrogram("scale")
            },
            frequency : function () {
                if (app.selectedSatellit !== -1) {
                    this.loadingSatellitCoords(app.satellits[app.selectedSatellit].id)
                }
                localStorage.setItem('frequency', JSON.stringify(Number(app.frequency)))
            },
            
        },
        methods: {
            interfase (item) {
                switch (item) {
                    case "status":
                        app.status = !app.status;
                        break;
                    case "theme":
                        app.theme = !app.theme
                        app.theme   ? style.setAttribute('href', "/static/css/main_dark.css") 
                                    : style.setAttribute('href', "/static/css/main.css") 
                        localStorage.setItem('theme', app.theme)
                        break;
                    case "spectrogram":
                        app.showSpectrogram = !app.showSpectrogram
                        if(app.showSpectrogram) {
                            this.loadingSpectrogram()
                        }
                        break;
                }
            },
            selectSatellit(index) {
                this.zeroingState()
                app.selectedSatellit = index
                this.loadingSeanses(app.satellits[index].id)
                this.loadingSatellitCoords(app.satellits[index].id)

                
            },
            countDelta(){
                let tempSin =   sin(app.antenna[0]) * 
                                sin(app.satellit[0], true)

                let tempCos =   cos(app.antenna[0]) *
                                cos(app.satellit[0], true) * 
                                cos(app.antenna[1] / 180 * Math.PI - app.satellit[1], true )

                app.delta = Math.acos(tempCos + tempSin) / Math.PI * 180
                app.delta = round( app.delta )
            },
