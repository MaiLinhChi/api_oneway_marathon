"use strict";

const ClubModel       = require("../model/Club");
const mongoose        = require("mongoose");

module.exports = {
    get: async (req) => {
        const options = {};
        const { name, keyword, page, pageSize } = req.query;
        try {
            const keywordCondition = keyword ? { $or:[
                { name: { $regex: keyword, $options: 'i'} },
            ]} : {} 
            const skip = page ? page -1 : 0
            const limit = pageSize || 20
            const sort = req.query.sort || 'desc'
            if(name) options.name = { $regex: new RegExp(name), $options: 'i' }
            const club = await ClubModel.find({
                $and: [options, keywordCondition]
            }).limit(limit).skip(skip * limit).sort({ name: sort })
            const totalRecord = await ClubModel.countDocuments(
                {
                    $and: [options, keywordCondition]
                }
            )
            return {
                totalRecord,
                totalPaging: Math.ceil(totalRecord / limit),
                data: club,
                status: true,
                message: 'success',
                messageKey: 'get_success'
            }
           } catch (error) {
                return error
           }
    },
    getById: async (req) => {
        try {
            const {id} = req.params
            const club = await ClubModel.findOne({_id: id})
            return {message: 'success', status: true, messageKey: 'get_success', data: club}
        } catch (error) {
            return error
        }
    },
    post: async (req) => {
        const { clubName } = req.payload;
        try {
            const isExist = ClubModel.findOne({clubName: clubName.trim()})
            if(isExist) return {
                message: 'This club already exist',
                status: false,
                statusCode: 400,
                messageKey: 'club_exist'
            }
            const club = new ClubModel({
                clubName
            });
            const ins = await club.save();
            return {message: 'success', data: ins, statusCode: 200, messageKey: 'post_success'};
        } catch (error) {
            return error
        }
    },
    update: async (req) => {
        const { id } = req.params;
        try {
            const club = await ClubModel.findById({_id: id});
            if (!club) return {
                message: 'club not found'
            }
            const newClub = await club.updateOne(req.payload, { new: true });
            return {
                message: 'success',
                data: newClub,
                statusCode: 200,
                messageKey: 'update_success'
            };
           } catch (error) {
                return error
           }
    },
    delete: async (req) => {
        const {id} = req.params
        try{
            const club = await ClubModel.findByIdAndDelete({_id: id});
            if(!club) return {message: 'Not found club', status: false, statusCode: 404, messageKey: 'club_not_found', data: club};
            return {message: 'success', data: club, statusCode: 200, messageKey: 'success'};
        }catch(error){
            return error
        }
    }
}