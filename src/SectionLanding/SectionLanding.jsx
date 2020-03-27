import "../SectionLanding/SectionLanding.scss";
// import { sendGAEvent } from 'actions/factory';
// import { fetchMerchant } from 'actions/merchant';
// import { fetchNewsFeed } from 'actions/newsfeed';
// import { GENERIC_POPUP, open, SEARCH_FRANCHISED_POPUP } from 'actions/popup';
// import cx from 'classnames';
// import BaseComponent from 'components/base';
// import ImageLazy from 'components/statics/img-lazy';
import React from "react";
// import { Waypoint } from 'react-waypoint';
function MerchantItem({ params, merchant }) {
  const merchantUrl = merchant.username
    ? `/${merchant.username}`
    : `/b/${merchant.slug}`;
  const metadata = {
    name: "Tiger Sugar - Đường nâu sữa",
    avatar:
      "https://tea-3.lozi.vn/v1/images/original/tigersugar-duong-nau-sua-thanh-thai-quan-10-ho-chi-minh-1584507638900822601-eatery-avatar-1584611735",
    address: "173/35 Thành Thái, Phường 14, Quận 10",
    promotions: [{ value: 60, type: "percent" }]
  };
  const promotion = (() => {
    if (metadata.groupPromotion) return metadata.groupPromotion;
    if (
      metadata.promotionCampaign &&
      metadata.promotionCampaign.type === "fixed_price"
    )
      return metadata.promotionCampaign;
    if (metadata.promotions && metadata.promotions[0])
      return metadata.promotions[0];
    if (params.promotion) return {};
    return null;
  })();
  return (
    <a
      title={metadata.name}
      href={merchantUrl}
      className="search-result-item search-result-merchant"
    >
      <img alt="avatar" />
      <div className="content">
        <h3>{metadata.name}</h3>
        <p key="address" className="address">
          {metadata.address && metadata.address.full}
        </p>
        ​
        {(() => {
          if (!!promotion) {
            return <span className="promotion">promo</span>;
          }
        })()}
      </div>
    </a>
  );
}

class Section extends React.Component {
  state = {
    loading: undefined,
    page: undefined
  };
  renderShimmer = key => {
    return (
      <div
        key={key}
        className="search-result-item search-result-merchant shimmer-animation"
      >
        {/* <ImageLazy
          shape="round-square"
          placeholder="/dist/images/placeholder.png"
        /> */}
        <div className="content">
          {/* <h3 className="shimmer-text w-60" /> */}
          <p className="shimmer-text w-40" />
          <p className="shimmer-text" />
        </div>
      </div>
    );
  };
  renderNotFound = () => {
    return (
      <div className="not-found">
        <img src="/dist/images/loship-404.png" alt="Not found" />
        <h3>
          {this.getString(
            "sorry_loship_has_no_results_you_are_looking_for",
            "search"
          )}
        </h3>
        <p>
          {this.getString(
            "check_spelling_and_try_again_or_search_with_different_keywords",
            "search"
          )}
        </p>
      </div>
    );
  };
  renderMerchant = (merchant, isMerchantChain) => {
    if (isMerchantChain && !merchant.eateryChain) return null;
    return (
      <MerchantItem
        key={`${merchant.id}${isMerchantChain ? "-chain" : ""}`}
        params={this.getParams()}
        merchant={merchant}
        getString={this.getString}
      />
    );
  };
  render() {
    const {
      title,
      icon,
      //   CustomTitle,
      data,
      status
      //   extras,
      //   params,
      //   changePage,
      //   submit,
      //   mode
    } = this.props;
    // const loadMore = extras && extras.get("loadMore");
    if (!data || !data.size) {
      if (!["PENDING", "INIT", undefined].includes(status))
        return (
          <div className="section-result-landing">{this.renderNotFound()}</div>
        );
      return (
        <div className="section-result-landing">
          <h2>
            <i className={`lz lz-${icon}`} />
            {title}
          </h2>
          {/* {!this.props.mode.includes("preload") && <Waypoint />} */}
          {/* <div className={cx("search-result-list")}>
            {[...Array(6).keys()].map(this.renderShimmer)}
          </div> */}
        </div>
      );
    }

    return (
      <div className="section-result-landing">
        <h2>
          <i className={`lz lz-${icon}`} />
          {title}
        </h2>
        {/* <div className={cx("search-result-list")}>
          {data.toArray().flatMap(searchResult => {
            return this.renderMerchant(searchResult);
          })}
          <div className="search-result-item search-result-see-all">
            See all
          </div>
        </div> */}
      </div>
    );
  }
  load = (props, force) => {
    if (!props) props = this.props;
    if (this.loadDebound) clearTimeout(this.loadDebound);
    this.loadDebound = setTimeout(() => {
      if (!props.data || force) {
        if (props.location.pathname === "/tim-kiem" && !this.getParams(props).q)
          return;
        this.props
          .dispatch
          //   fetchNewsFeed({
          //     query: { ...this.getParams(props) },
          //     callback: this.props.onLoaded,
          //     force
          //   })
          ();
      }
    }, 500);
  };
  cancelLoad = () => {
    if (this.loadDebound) clearTimeout(this.loadDebound);
  };
  loadMore = () => {
    if (this.loadMoreDebound) clearTimeout(this.loadMoreDebound);
    this.loadMoreDebound = setTimeout(() => {
      this.setState({ page: (this.state.page || 1) + 1 }, () => {
        this.props
          .dispatch
          //   fetchNewsFeed({
          //     query: { ...this.getParams(), page: this.state.page },
          //     loadMore: true
          //   })
          ();
      });
    }, 500);
  };
  cancelLoadMore = () => {
    if (this.loadMoreDebound) clearTimeout(this.loadMoreDebound);
  };
  openFranchisedPopup = merchant => e => {
    e.preventDefault();
    e.stopPropagation();
    if (this.state.loading) return;
    if (!merchant) return;
    this.props
      .dispatch
      //   open(SEARCH_FRANCHISED_POPUP, {
      //     merchant,
      //     onItemClick: (data, callback) => this.switchToMerchant(data)(callback),
      //     geoLocation: this.context.geoLocation
      //   })
      ();
  };
  switchToMerchant = merchant => e => {
    /** Handle right-click and ctrl+click
     ** Definitely need another handy way to achieve this :(
     */
    if (e.ctrlKey || e.metaKey) return;
    if (typeof e.preventDefault === "function") {
      e.preventDefault();
      e.stopPropagation();
    }
    // const callback = typeof e === "function" && e;
    if (this.state.loading) return;
    if (!merchant || !this.props.history) return;
    this.setState({ loading: `merchant.${merchant.id}` });
    this.props
      .dispatch
      //   fetchMerchant({
      //     merchant: merchant.slug,
      //     callback: () => {
      //       const merchantUrl = merchant.username
      //         ? `/${merchant.username}`
      //         : `/b/${merchant.slug}`;
      //       this.props.history.push(merchantUrl);
      //       typeof callback === "function" && callback();
      //       typeof this.props.onMerchantLoaded === "function" &&
      //         this.props.onMerchantLoaded();
      //     }
      //   })
      ();
    this.sendGATracking("merchant");
  };
  sendGATracking = trackingLabel => {
    if (!this.props.trackingAction) return;
    // const trackingCategory = this.props.trackingCategory || "loship_section";
    if (this.props.trackingLabel) trackingLabel = this.props.trackingLabel;
    // sendGAEvent(trackingCategory, this.props.trackingAction, trackingLabel);
  };
  handleTurnOnLocationService = () => {
    const { geoLocation } = this.context;
    if (!geoLocation || (geoLocation.latitude && geoLocation.longitude)) return;
    if (geoLocation.state === "denied") {
      return this.props
        .dispatch
        // open(GENERIC_POPUP, {
        //   title: this.getString("allow_location"),
        //   content: this.getString("turn_on_location_service", "", [
        //     this.getString(
        //       this.context.geoLocation.state === "denied"
        //         ? "allow_btn"
        //         : "enable_btn"
        //     ),
        //     <a
        //       className="ml-4"
        //       href="https://support.google.com/chrome/answer/142065?co=GENIE.Platform%3DDesktop&hl=en"
        //       target="_blank"
        //     >
        //       {this.getString("view_guide")}
        //     </a>
        //   ]),
        //   cancelBtn: {}
        // })
        ();
    }
    this.context.getGeoLocation({
      type: "DIRECT",
      callback: () => this.load(this.props, true)
    });
  };
}
export default Section;
