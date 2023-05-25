/**
 * Created by A on 7/18/17.
 */
"use strict";
const Pac = require("../package.json");
const User = require("../route/User");
const Marathon = require("../route/Marathon");
const Bib = require("../route/Bib");
const PaymentMethod = require("../route/PaymentMethod");
const Ipn = require("../route/Ipn");
const Group = require("../route/Group");
const Province = require("../route/Province")
const District = require("../route/District")
const Ward = require("../route/Ward")
const Club = require("../route/Club")

module.exports = [
  {
    method: "GET",
    path: "/",
    config: {
      tags: ["api", "General"],
      description: "access home",
      handler: (req, res) => {
        return res.response("Welcome to " + Pac.name + " !!!").code(200);
      },
    },
  },
  { method: "GET", path: "/me", config: User.getMe },

  { method: "POST", path: "/authenticate", config: User.postAuthenticate },
  {
    method: "POST",
    path: "/admin/authenticate",
    config: User.postAuthenticateAdmin,
  },
  { method: "POST", path: "/users", config: User.post },
  {
    method: "POST",
    path: "/users/password/forgot",
    config: User.postPasswordForgot,
  },
  {
    method: "PUT",
    path: "/users/password/forgot",
    config: User.putPasswordForgot,
  },
  { method: "GET", path: "/admin/users", config: User.get },
  { method: "GET", path: "/users/{id}", config: User.getById },
  { method: "PUT", path: "/password", config: User.putPassword },

  { method: "POST", path: "/marathons", config: Marathon.post },
  { method: "GET", path: "/marathons", config: Marathon.get },
  { method: "GET", path: "/marathon/{id}", config: Marathon.getById },
  { method: "PUT", path: "/marathon/{id}", config: Marathon.putById },

  { method: "POST", path: "/bib", config: Bib.post },
  { method: "GET", path: "/bibs", config: Bib.get },
  { method: "GET", path: "/bib/{id}", config: Bib.getById },
  { method: "PUT", path: "/bib/{id}", config: Bib.putById },

  { method: "POST", path: "/payment-method", config: PaymentMethod.post },
  { method: "GET", path: "/payment-method", config: PaymentMethod.get },
  {
    method: "GET",
    path: "/payment-method/{id}",
    config: PaymentMethod.getById,
  },
  {
    method: "PUT",
    path: "/payment-method/{id}",
    config: PaymentMethod.putById,
  },
  {
    method: "DELETE",
    path: "/payment-method/{id}",
    config: PaymentMethod.deleteById,
  },

  {
    method: "GET",
    path: "/ipn",
    config: Ipn.getIpn,
  },

  { method: "GET", path: "/ipns", config: Ipn.get },
  { method: "GET", path: "/ipn/{id}", config: Ipn.getById },
  {
    method: "DELETE",
    path: "/ipn/{id}",
    config: Ipn.deleteById,
  },
  
  { method: "POST", path: "/group/authenticate", config: Group.loginGroup },
  { method: "PUT", path: "/group/join/{id}", config: Group.joinGroup },
  { method: "POST", path: "/group", config: Group.post },
  { method: "GET", path: "/groups", config: Group.get },
  { method: "GET", path: "/group/{id}", config: Group.getById },
  { method: "DELETE", path: "/group/{id}", config: Group.deleteById },

  // Province Distric Ward
  { method: "GET", path: "/province", config: Province.get },
  { method: "GET", path: "/province/{id}", config: Province.getById },
  { method: "GET", path: "/district", config: District.get },
  { method: "GET", path: "/ward", config: Ward.get },
  
  // Club
  { method: "GET", path: "/club", config: Club.get },
  { method: "GET", path: "/club/{id}", config: Club.getById },
  { method: "PUT", path: "/club/{id}", config: Club.update },
  { method: "POST", path: "/club", config: Club.post },
  { method: "DELETE", path: "/club/{id}", config: Club.delete },

  // Order
  { method: "GET", path: "/orders", config: Club.get },
  { method: "GET", path: "/order/{id}", config: Club.getById },
  { method: "PUT", path: "/order/{id}", config: Club.update },
  { method: "POST", path: "/order", config: Club.post },
  { method: "DELETE", path: "/order/{id}", config: Club.delete },
];
