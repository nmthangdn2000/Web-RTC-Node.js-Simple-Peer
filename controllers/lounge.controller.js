const getLounge = (req, res) => {
    res.render('frontend/lounge.ejs')
}
//
const getLoungeID = (req, res) => {
    res.render('frontend/lounge.ejs', {roomID: req.params.room})
}

module.exports = {
    getLounge,
    getLoungeID
}