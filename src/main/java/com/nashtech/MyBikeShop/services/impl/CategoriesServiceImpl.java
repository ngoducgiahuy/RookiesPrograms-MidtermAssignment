package com.nashtech.MyBikeShop.services.impl;

import java.util.List;
import java.util.Optional;

import javax.validation.ConstraintViolationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import com.nashtech.MyBikeShop.DTO.CategoriesDTO;
import com.nashtech.MyBikeShop.entity.CategoriesEntity;
import com.nashtech.MyBikeShop.exception.ObjectAlreadyExistException;
import com.nashtech.MyBikeShop.repository.CategoriesRepository;
import com.nashtech.MyBikeShop.services.CategoriesService;
import com.nashtech.MyBikeShop.services.ProductService;

@Service
public class CategoriesServiceImpl implements CategoriesService {
	@Autowired
	CategoriesRepository categoriesRepository;

	@Autowired
	ProductService productService;

	public List<CategoriesEntity> retrieveCategories() {
		Sort sortable = Sort.by("id").ascending();
		return categoriesRepository.findAll(sortable);
	}

	public Optional<CategoriesEntity> getCategories(int id) {
		return categoriesRepository.findById(id);
	}

	public boolean createCategories(CategoriesDTO categoriesDTO) {
		try {
			boolean checkName = checkExistName(0, categoriesDTO.getName());
			if (checkName) {
				CategoriesEntity categoriesConvert = new CategoriesEntity(categoriesDTO);
				categoriesRepository.save(categoriesConvert);
				return true;
			} else
				throw new ObjectAlreadyExistException("There is a category with the same Name");
		} catch (IllegalArgumentException | ConstraintViolationException ex) {
			return false;
		}

	}

	public boolean checkExistName(int id, String name) {
		List<CategoriesEntity> cateList = categoriesRepository.findByNameIgnoreCase(name);
		if (cateList.isEmpty())
			return true;
		else if ((cateList.size() > 1) || ((cateList.size() == 1) && (cateList.get(0).getId() != id)))
			return false;
		else
			return true;
	}

	public boolean deleteCategories(int id) {
		categoriesRepository.deleteById(id);
		return true;
	}

	public boolean updateCategories(CategoriesDTO categoriesDTO) {
		try {
			boolean check = checkExistName(categoriesDTO.getId(), categoriesDTO.getName());
			if (check) {
				CategoriesEntity categoriesConvert = new CategoriesEntity(categoriesDTO);
				categoriesRepository.save(categoriesConvert);
				return true;
			} else
				throw new ObjectAlreadyExistException("There is a category with the same Name");
		} catch (IllegalArgumentException | ConstraintViolationException ex) {
			return false;
		}
	}
}
