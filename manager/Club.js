// "use strict";

// const ClubModel       = require("../model/Stores");
// const mongoose          = require("mongoose");

// module.exports = {
//     getClub: async (req) => {
//         const options = {};
//         const {
//             keyword,
//             storeName,
//             pageSize,
//             page,
//             sorting,
//         } = req.query;
//         try {
//             const keywordCondition = keyword ? { $or:[
//                 { name: { $regex: keyword, $options: 'i'} },
//             ]} : {} 
//             const skip = page ? page -1 : 0
//             const limit = pageSize || 20
//             const sort = sorting || 'desc'
//             if(storeName) options.storeName = { $regex: new RegExp(storeName) }
//             const _store = await ClubModel.find({
//                 $and: [options, keywordCondition]
//             }).limit(limit).skip(skip * limit).sort({ storeName: sort })
//             const totalRecord = await ClubModel.countDocuments(
//                 {
//                     $and: [options, keywordCondition]
//                 }
//             )
//             return {
//                 totalRecord,
//                 totalPaging: Math.ceil(totalRecord / limit),
//                 data: _store,
//                 status: true,
//                 message: 'success',
//                 statusCode: 200,
//                 messageKey: 'success'
//             }
//            } catch (error) {
//                 return err
//            }
//     },
//     getClubById: async (req) => {
//         try {
//             const {id} = req.params
//             const {pageIndex, paySize} = req.payload
//             const store = await ClubModel.findOne({_id: id})
//             // const productStall = 
//             return {message: 'success', status: true, messageKey: 'success', data: store}
//         } catch (error) {
//             return err
//         }
//     },
//     postClub: async (req) => {
//         const { 
//             storeName,
//             storeImage
//         } = req.payload;
//         const uploadImage = storeImage ? (await upload(process.env.AWS_ENV, 'store', storeName, storeImage)).url : errorImage;
//         try {
//             const upl = new ClubModel({
//                 storeName, 
//                 storeImage: uploadImage
//             });
//             await upl.save();
//             return {message: 'success', data: upl, statusCode: 200, messageKey: 'post_new_store_success'};
//         } catch (error) {
//             console.log(error)
//             return {message: error.message, statusCode: 400}
//         }
//     },
//     updateClub: async (req) => {
//         const { id } = req.params;
//         const { 
//             storeName,
//             storeImage
//         } = req.payload;
//         try {
//             if (!mongoose.Types.ObjectId.isValid(id)) return {message: `No store with id: ${id}`, statusCode: 404};
//             const _store = await ClubModel.findById({_id: id});
//             let _image = _store.storeImage;
//             if(storeImage) {
//                 const _name = storeName || _store.storeName;
//                 const uploadPicture = storeImage ? (await upload(process.env.AWS_ENV, 'store', _name, storeImage)).url : errorImage;
//                 _image = uploadPicture;
//             }
//             const newStore = await _store.updateOne({ $set: {
//                 storeName,
//                 storeImage: _image,
                
//             } }, { new: true });
//             return {message: 'success', data: newStore, statusCode: 200, messageKey: 'update_store_success'};
//            } catch (error) {
//                 console.log(error)
//                 return {message: error.message, statusCode: 400}
//            }
//     },
//     deleteClub: async (req) => {
//         const {id} = req.params
//         try{
//             if (!mongoose.Types.ObjectId.isValid(id)) return {message: `No store with id: ${id}`, statusCode: 404};
//             const ins = await ClubModel.findByIdAndDelete({_id: id});
//             if(!ins) return {message: 'Not found store', status: false, statusCode: 404, messageKey: 'store_not_found', data: ins};
//             return {message: 'success', data: ins, statusCode: 200, messageKey: 'delete_store_success'};
//         }catch(error){
//             return error
//         }
//     }
// }