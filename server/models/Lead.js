//==

const mongoose = require("mongoose");

const LeadSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  phoneStatus: {
    type: String,
    required: false,
  },
  emailInvalid: {
    type: String,
    required: false,
  },
  GloballyOptedOutOfEmail: {
    type: String,
    required: false,
  },
  GloballyOptedOutOfBuyerAgentEmail: {
    type: String,
    required: false,
  },
  GloballyOptedOutOfListingAgentEmail: {
    type: String,
    required: false,
  },
  GloballyOptedOutOfLenderEmail: {
    type: String,
    required: false,
  },
  GloballyOptedOutOfAlerts: {
    type: String,
    required: false,
  },
  OptInDate: {
    type: Date,
    required: false,
  },
  BuyerAgentCategory: {
    type: String,
    required: false,
  },
  ListingAgentCategory: {
    type: String,
    required: false,
  },
  LenderCategory: {
    type: String,
    required: false,
  },
  BuyerAgent: {
    type: String,
    required: false,
  },
  ListingAgent: {
    type: String,
    required: false,
  },
  Lender: {
    type: String,
    required: false,
  },
  OriginalSource: {
    type: String,
    required: false,
  },
  OriginalCampaign: {
    type: String,
    required: false,
  },
  LastAgentNote: {
    type: Date,
    required: false,
  },
  eAlerts: {
    type: String,
    required: false,
  },
  VisitTotal: {
    type: Number,
    required: false,
  },
  listingviewcount: {
    type: Number,
    required: false,
  },
  AvgListingPrice: {
    type: Number,
    required: false,
  },
  NextCallDue: {
    type: String,
    required: false,
  },
  LastAgentCallDate: {
    type: Date,
    required: false,
  },
  LastLenderCallDate: {
    type: String,
    required: false,
  },
  FirstVisitDate: {
    type: Date,
    required: false,
  },
  LastVisitDate: {
    type: Date,
    required: false,
  },
  RegisterDate: {
    type: Date,
    required: false,
  },
  LeadType: {
    type: String,
    required: false,
  },
  AgentSelected: {
    type: String,
    required: false,
  },

  LenderOptIn: {
    type: String,
    required: false,
  },
  Address: {
    type: String,
    required: false,
  },
  City: {
    type: String,
    required: false,
  },
  State: {
    type: String,
    required: false,
  },
  ZipCode: {
    type: String,
    required: false,
  },
  Link: {
    type: String,
    required: false,
  },
  Birthday: {
    type: Date,
    required: false,
  },
  HomeClosingDate: {
    type: Date,
    required: false,
  },
  tagsList: {
    type: Array,
  },
  categoriesList: {
    type: Array,
  },
  didLeaveReview: {
    type: String,
  },
  didClosingGift: {
    type: String,
  },
  didsocialMediaFriends: {
    type: String,
  },
  didPostCardDrip: {
    type: String,
  },
  didAnniversaryDrip: {
    type: String,
  },
  tags: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tag",
    },
  ],
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: {
    type: Date,
    default: new Date(),
  },
});

// Define a pre-save middleware to sanitize the phoneNumber field
LeadSchema.pre("save", function (next) {
  if (this.phone) {
    this.phone = this.phone.replace(/\D/g, ""); // Remove all non-numeric characters
  }
  next();
});

//  save VisitTotal in number format instead of string format to allow for sorting in the client
LeadSchema.pre("save", function (next) {
  if (this.VisitTotal) {
    this.VisitTotal = parseInt(this.VisitTotal);
  }
  next();
});

// save these fields in number format instead of string format to allow for sorting in the client AvgListingPrice, listingviewcount
LeadSchema.pre("save", function (next) {
  if (this.AvgListingPrice) {
    this.AvgListingPrice = parseInt(this.AvgListingPrice);
  }
  next();
});

LeadSchema.pre("save", function (next) {
  if (this.listingviewcount) {
    this.listingviewcount = parseInt(this.listingviewcount);
  }
  next();
});

LeadSchema.pre("save", function (next) {
  if (this.FirstVisitDate) {
    this.FirstVisitDate = new Date(this.FirstVisitDate);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.HomeClosingDate) {
    this.HomeClosingDate = new Date(this.HomeClosingDate);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.LastAgentCallDate) {
    this.LastAgentCallDate = new Date(this.LastAgentCallDate);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.LastAgentNote) {
    this.LastAgentNote = new Date(this.LastAgentNote);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.LastVisitDate) {
    this.LastVisitDate = new Date(this.LastVisitDate);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.OptInDate) {
    this.OptInDate = new Date(this.OptInDate);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.RegisterDate) {
    this.RegisterDate = new Date(this.RegisterDate);
  }
  next();
});
LeadSchema.pre("save", function (next) {
  if (this.Birthday) {
    this.Birthday = new Date(this.Birthday);
  } 
  next();
});


module.exports = mongoose.model("Lead", LeadSchema);
