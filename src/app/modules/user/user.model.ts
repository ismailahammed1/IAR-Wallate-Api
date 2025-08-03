import { model, Schema } from "mongoose";
import { IAuthProvider, isActive, Iuser, Role } from "./user.interface";

const authProviderSchema = new Schema<IAuthProvider>(
  {
    provider: { type: String, required: true },
    providerID: { type: String, required: true },
  },
  {
    versionKey: false,
    _id: false,
  }
);

const userSchema = new Schema<Iuser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: Object.values(Role),
      default: Role.USER,
    },
    phone: { type: String },
    picture: { type: String },
    address: { type: String },
    isDeleted: { type: Boolean, default: false },
    isActive: {
      type: String,
      enum: Object.values(isActive),
      default: isActive.ACTIVE,
    },
    isVerified: { type: Boolean, default: false },
    wallet: {
      type: Schema.Types.ObjectId,
      ref: "Wallet",
      required: false,
    },
    auths: [authProviderSchema],
    approved: { type: Boolean, default: false },
    commissionRate: { type: Number, default: 0 },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
userSchema.virtual('id').get(function() {
  return this._id.toString();
})

export const User = model<Iuser>("User", userSchema);
