const handleRegister = (req,res, db, bcrypt) => {
    const {email, name, password} = req.body
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission')
    }

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                res.json(user[0])
            })
        })
        .then(trx.commit)
        .then(trx.rollback)   
    })
    .catch(err => {
        console.log(err)
        return res.status(400).json('unable to join')
    })
    // .catch(err => res.status(400).json('unable to join'))     
}

module.exports = {
    handleRegister: handleRegister
}