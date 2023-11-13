const passport=require('passport')
const GoogleStrategy=require('passport-google-oauth20').Strategy
const User=require('../models/user-model')
require('dotenv').config();


passport.serializeUser((user,done)=>{
        done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        done(null,user)
    })
})

passport.use(
    new GoogleStrategy({
        //opciones de estrategia de google
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:'/auth/google/redirect'
    },(accessToken,refreshToken,profile,done)=>{
        //funcion callback passport

        console.log(profile)
        //el usuario esta ya registrado con ese email
        User.findOne({googleId:profile.id}).then((eldato)=>{
            if(eldato){
                        console.log('el usuario ya esta registrado en mi base por segundo vez')
                        done(null,eldato)
            }else{
                   
                    new User({
                        googleId:profile.id,
                        username:profile.displayName,
                        thumbnail:profile.photos[0].value
                    })
                    .save()
                    .then((pepe)=>{
                        console.log('el usuario se creo con exito',pepe)
                        done(null,pepe)
                        
                    })
            }
        })
    })
)
