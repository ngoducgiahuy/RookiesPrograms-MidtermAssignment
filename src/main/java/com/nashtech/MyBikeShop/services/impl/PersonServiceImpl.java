package com.nashtech.MyBikeShop.services.impl;

import java.util.stream.Collectors;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.nashtech.MyBikeShop.DTO.PersonDTO;
import com.nashtech.MyBikeShop.entity.OrderEntity;
import com.nashtech.MyBikeShop.entity.PersonEntity;
import com.nashtech.MyBikeShop.entity.UserEntity;
import com.nashtech.MyBikeShop.exception.ObjectAlreadyExistException;
import com.nashtech.MyBikeShop.exception.ObjectNotFoundException;
import com.nashtech.MyBikeShop.exception.ObjectPropertiesIllegalException;
import com.nashtech.MyBikeShop.payload.request.ChangePassRequest;
import com.nashtech.MyBikeShop.repository.PersonRepository;
import com.nashtech.MyBikeShop.services.PersonService;

@Service
public class PersonServiceImpl implements PersonService {
	@Autowired
	private PersonRepository personRepository;

	final private PasswordEncoder encoder;

	public PersonServiceImpl(PersonRepository personRepository, PasswordEncoder encoder) {
		this.personRepository = personRepository;
		this.encoder = encoder;
	}

	public List<PersonEntity> retrievePersons() {
		return personRepository.findAll();
	}

	public Optional<PersonEntity> getPerson(int id) {
//		Optional<Person> optperson = personRepository.findById(email);
//		Person person = optperson.get();
//		return person;
		return personRepository.findById(id);
	}

	public PersonEntity getPerson(String email) {
//		Optional<Person> optperson = personRepository.findById(email);
//		Person person = optperson.get();
//		return person;
		return personRepository.findByEmail(email);
	}

	public List<PersonEntity> getPersonsPage(int num, int size, String role) {
		Sort sortable = Sort.by("id").descending();
		Pageable pageable = PageRequest.of(num, size, sortable);
		return personRepository.findByRole(pageable, role.toUpperCase());
	}

	public PersonEntity createPerson(PersonDTO personDTO) {
		Optional<PersonEntity> person = personRepository.findById(personDTO.getId());
		if (person.isPresent()) {
			throw new ObjectAlreadyExistException("There is a person with email " + person.get().getEmail());
		} else {
			PersonEntity personEntity = new PersonEntity(personDTO);
			return personRepository.save(personEntity);
		}
	}

	public boolean deletePerson(int id) {
		personRepository.deleteById(id);
		return true;
	}

	public boolean updatePerson(PersonDTO personDTO) {
		PersonEntity personEntity = getPerson(personDTO.getId()).get();
		boolean checkEmailChange = personEntity.getEmail().equals(personDTO.getEmail());
		PersonEntity person = new PersonEntity(personDTO);

		person.setPassword(personEntity.getPassword());
		person.setRole(personEntity.getRole());

		// personEntity.setEmail(encoder.encode(personDTO.getPassword()));
		if (checkEmailChange) { // Không đổi email
			personRepository.save(person);
		} else { // Email được đổi, kiểm tra trùng
			List<PersonEntity> list = personRepository.findByEmailIgnoreCase(personDTO.getEmail());
			if (list.isEmpty()) {
				personRepository.save(person);
			} else {
				throw new ObjectAlreadyExistException("There is a user using this email");
			}
		}
		return true;
	}

	public boolean checkExistEmailUpdate(String email, int id) {
		List<PersonEntity> list = personRepository.findByEmailIgnoreCase(email);
		if (list.isEmpty()) {
			return true;
		} else if ((list.size() > 1) || ((list.size() == 1) && (list.get(0).getId() != id)))
			return false;
		else
			return true;
	}

//	public boolean updatePassword(ChangePassRequest account) {
//		boolean check = personRepository.existsByEmail(account.getEmail());
//		if (check) {
//			PersonEntity person = personRepository.findByEmail(account.getEmail());
//			if (person.getPassword().equals(encoder.encode(account.getOldPassword()))) {
//				person.setPassword(encoder.encode(account.getNewpassword()));
//				personRepository.save(person);
//				return true;
//			} else {
//				throw new ObjectPropertiesIllegalException("Old password is incorrect");
//			}
//		} else {
//			throw new ObjectNotFoundException("Not find account with this email: " + account.getEmail());
//		}
//	}

	public int getTotalByRole(String role) {
		return personRepository.countByRole(role);
	}
}
