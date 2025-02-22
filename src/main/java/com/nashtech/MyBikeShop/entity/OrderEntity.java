package com.nashtech.MyBikeShop.entity;

import java.time.LocalDateTime;
import java.util.Objects;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.nashtech.MyBikeShop.DTO.OrderDTO;

@Entity
@Table(name = "orderbill")
public class OrderEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "timebought")
	private LocalDateTime timebought;

	@Column(name = "totalcost")
	private Float totalCost;

	@Column(name = "address")
	private String address;

	@Column(name = "status")
	private boolean status;

	@ManyToOne
	@JoinColumn(name = "customerid")
	private PersonEntity customers;

	@OneToMany(mappedBy = "order", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	Set<OrderDetailEntity> orderDetails;

	public OrderEntity() {
		super();
	}

	public OrderEntity(int id, Float totalCost, String address, boolean status, PersonEntity customers) {
		super();
		this.id = id;
		this.totalCost = totalCost;
		this.address = address;
		this.status = status;
		this.customers = customers;
	}

	public OrderEntity(OrderDTO order) {
		super();
		this.id = order.getId();
		this.totalCost = order.getTotalCost();
		this.address = order.getAddress();
		this.status = order.isStatus();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public PersonEntity getCustomers() {
		return customers;
	}

	public void setCustomers(PersonEntity customers) {
		this.customers = customers;
	}

	public LocalDateTime getTimebought() {
		return timebought;
	}

	public void setTimebought(LocalDateTime timebought) {
		this.timebought = timebought;
	}

	public float getTotalCost() {
		return totalCost;
	}

	public void setTotalCost(float totalCost) {
		if (totalCost < 0) {
			throw new IllegalArgumentException("Total must not below zero");
		}
		this.totalCost = totalCost;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public boolean isStatus() {
		return status;
	}

	public void setStatus(boolean status) {
		this.status = status;
	}

	public Set<OrderDetailEntity> getOrderDetails() {
		return orderDetails;
	}

	public void setOrderDetails(Set<OrderDetailEntity> orderDetails) {
		this.orderDetails = orderDetails;
	}

	public void setTotalCost(Float totalCost) {
		if (totalCost < 0) {
			throw new IllegalArgumentException("Total must not below zero");
		}
		this.totalCost = totalCost;
	}

	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (obj == null)
			return false;
		if (getClass() != obj.getClass())
			return false;
		OrderEntity other = (OrderEntity) obj;
		return Objects.equals(address, other.address) && Objects.equals(customers, other.customers) && id == other.id
				&& Objects.equals(orderDetails, other.orderDetails) && status == other.status
				&& Objects.equals(timebought, other.timebought) && Objects.equals(totalCost, other.totalCost);
	}

}
