package com.nashtech.MyBikeShop.DTO;

import java.util.Date;

public class RateDTO {
	private String productId;
	private int customerId;
	private int rateNum;
	private String rateText;
	public RateDTO() {}

	public RateDTO(String productId, int customerId, int rateNum, String rateText, Date dateReview) {
		super();
		this.productId = productId;
		this.customerId = customerId;
		this.rateNum = rateNum;
		this.rateText = rateText;
	}

	public String getProductId() {
		return productId;
	}

	public void setProductId(String productId) {
		this.productId = productId;
	}

	public int getCustomerId() {
		return customerId;
	}

	public void setCustomerId(int customerId) {
		this.customerId = customerId;
	}

	public int getRateNum() {
		return rateNum;
	}

	public void setRateNum(int rateNum) {
		this.rateNum = rateNum;
	}

	public String getRateText() {
		return rateText;
	}

	public void setRateText(String rateText) {
		this.rateText = rateText;
	}
	
}
