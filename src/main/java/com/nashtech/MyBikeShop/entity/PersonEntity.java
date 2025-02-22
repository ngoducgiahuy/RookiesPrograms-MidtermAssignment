package com.nashtech.MyBikeShop.entity;

import java.util.Date;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.nashtech.MyBikeShop.DTO.PersonDTO;

@Entity
@Table(name = "persons")
public class PersonEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private int id;

	@Column(name = "email")
	private String email;

	@Column(name = "password")
	private String password;

	@Column(name = "fullname")
	private String fullname;

	@JsonFormat(pattern = "yyyy-MM-dd")
	@Column(name = "dob")
	private Date dob;

	@Column(name = "gender")
	private boolean gender;

	@Column(name = "address")
	private String address;

	@Column(name = "phonenumber")
	private String phonenumber;

	@Column(name = "role")
	private String role;

	@OneToMany(mappedBy = "customers", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<OrderEntity> orders;
	
	@OneToMany(mappedBy = "employee", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JsonIgnore
	private Set<OrderImportEntity> ordersImport;

	@OneToMany(mappedBy = "customer", fetch = FetchType.EAGER, cascade = CascadeType.ALL)
	@JsonIgnore
	Set<RateEntity> reviews;

	public PersonEntity() {
		super();
	}

	public PersonEntity(int id, String email, String password, String fullname, String role) {
		super();
		this.id = id;
		this.email = email;
		this.password = password;
		this.fullname = fullname;
		this.role = role;
	}

	public PersonEntity(PersonDTO personDTO) {
		super();
		this.id = personDTO.getId();
		this.email = personDTO.getEmail();
		this.password = personDTO.getPassword();
		this.fullname = personDTO.getFullname();
		this.dob = personDTO.getDob();
		this.gender = personDTO.isGender();
		this.address = personDTO.getAddress();
		this.phonenumber = personDTO.getPhonenumber();
		this.role = personDTO.getRole();
	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getFullname() {
		return fullname;
	}

	public void setFullname(String fullname) {
		this.fullname = fullname;
	}

	public Date getDob() {
		return dob;
	}

	public void setDob(Date dob) {
		this.dob = dob;
	}

	public boolean isGender() {
		return gender;
	}

	public void setGender(boolean gender) {
		this.gender = gender;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getPhonenumber() {
		return phonenumber;
	}

	public void setPhonenumber(String phonenumber) {
		this.phonenumber = phonenumber;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Set<RateEntity> getReviews() {
		return reviews;
	}

	public void setReviews(Set<RateEntity> reviews) {
		this.reviews = reviews;
	}

	public Set<OrderEntity> getOrders() {
		return orders;
	}

	public void setOrders(Set<OrderEntity> orders) {
		this.orders = orders;
	}

	public Set<OrderImportEntity> getOrdersImport() {
		return ordersImport;
	}

	public void setOrdersImport(Set<OrderImportEntity> ordersImport) {
		this.ordersImport = ordersImport;
	}
	
	
	
	
}
