import * as functions from "firebase-functions";

const stripe = require("stripe")(
    "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"
);
const cors = require("cors")({ origin: true });

exports.addCustomer = functions.https.onRequest((req: any, res: any) => {
    // Set your secret key: remember to change this to your live secret key in production
    // See your keys here: https://dashboard.stripe.com/account/apikeys
    cors(req, res, () => {
        stripe.customers
            .create({
                description: "Cookie lady app customer",
                email: req.body.cusEmail,
                name: req.body.cusName,
            })
            .then((customer: any) => {
                res.status(200).json({ cus: customer });
            })
            .catch((err: any) => {
                res.send(err);
            });
    });
});

exports.addCard = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        stripe.customers
            .createSource(req.body.userId, { source: req.body.sourceToken })
            .then((card: any) => {
                res.status(200).json(card);
            })
            .catch((err: any) => {
                res.json(err);
            });
    });
});

exports.getAllCards = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        stripe.customers
            .listSources(req.body.custId, { object: "card", limit: 3 })
            .then((cards: any) => {
                console.log(cards);
                res.status(200).json(cards);
            })
            .catch((err: any) => {
                res.send(err);
            });
    });
});

exports.charge = functions.https.onRequest((req, res) => {
    cors(req, res, () => {
        stripe.paymentIntents
            .create({
                amount: req.body.amount,
                currency: req.body.currency,
                payment_method_data: { type: "card", card: { token: req.body.token } },
                off_session: true,
                confirm: true,
                customer: req.body.custId,
                description: "Cookie lady app payment from " + req.body.email,
                shipping: req.body.shipping,
                receipt_email: req.body.email,

            })
            .then((charge: any) => {
                res.status(200).json(charge);
            })
            .catch((err: any) => {
                res.send(err);
            });
    });
});

