const Listing=require("../models/listing");
const Schema=require("../schema");
const mbxGeocoding=require("@mapbox/mapbox-sdk/services/geocoding");
const mapToken=process.env.MAPBOX_TOKEN;
const geocodingClient=mbxGeocoding({accessToken:mapToken});

//index route
module.exports.index=async (req, res) => {
    let listings = await Listing.find({});
    res.render("./listings/index.ejs", { listings });
}

//new route
module.exports.newindex= (req, res) => {
    req.flash("success", "add new listing");
    res.render("./listings/new.ejs");
}

//show route
module.exports.show=async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listings) {
        req.flash("error", "Listing is not exist!");
        res.redirect("./listings");
    }
    console.log(listings);
    res.render("./listings/show.ejs", { listings });
}

module.exports.createnew=async (req, res) => {
    let result = Schema.listingSchema.validate(req.body);
    let response=await geocodingClient
    .forwardGeocode({
        query:req.body.listing.location,
        limit:1,
    })
    .send();
    let url=req.file.path;
    let filename=req.file.filename;
    const newlisting = new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    newlisting.image={url,filename};

    newlisting.geometry=response.body.features[0].geometry;
    
    let savedListing= await newlisting.save();
    console.log(savedListing);
    req.flash("success", "New Listing get added!");
    res.redirect("listings");
}
//update
module.exports.update=async (req, res) => {
    let { id } = req.params;
    let listing=await Listing.findByIdAndUpdate(id, { ...req.body.listing });

    if(typeof req.file!=="undefined"){
        let url=req.file.path;
        let filename=req.file.filename;
        listing.image={url,filename};
        await listing.save();
    }
    req.flash("success", "Listing updataed!");
    res.redirect(`/listings/${id}`);
}
//edit
module.exports.edit=async (req, res) => {
    let { id } = req.params;
    let listings = await Listing.findById(id);
    if(!listings){
        req.flash("error","Listings you requested for does not exist");
        res.redirect("/listing");
    }

    let originalImageurl=listings.image.url;
    originalImageurl=r=originalImageurl.replace("/upload","/upload/h_300,w_250");
    res.render("./listings/edit.ejs", { listings,originalImageurl });
}

module.exports.distroy=async (req, res) => {
    let { id } = req.params;
    let deletelisting = await Listing.findByIdAndDelete(id);
    console.log(deletelisting);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings");
}