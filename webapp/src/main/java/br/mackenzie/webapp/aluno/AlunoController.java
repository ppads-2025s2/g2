package br.mackenzie.webapp.Aluno;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
class AlunoController {

	@Autowired
	private AlunoRepo alunoRepo;

	public AlunoController() {

	}

	@GetMapping("/api/Alunos")
	Iterable<Aluno> getAlunos(@RequestParam Optional<Long> faculdadeId) {

		return alunoRepo.findAll();

	}

	@GetMapping("/api/Alunos/{id}")
	Optional<Aluno> getAluno(@PathVariable long id) {
		return alunoRepo.findById(id);
	}

	@PostMapping("/api/Alunos")
	Aluno createAluno(@RequestBody Aluno p) {
		Aluno createdaluno = alunoRepo.save(p);
		return createdProf;
	}

	@PutMapping("/api/alunos/{alunoId}")
	Optional<Aluno> updateAluno(@RequestBody Aluno alunoRequest, @PathVariable long alunoId) {
		Optional<Aluno> opt = alunoRepo.findById(alunoId);
		if (opt.isPresent()) {
			if (alunoRequest.getId() == alunoId) {
				alunoRepo.save(alunoRequest);
				return opt;
			}
		}
		throw new ResponseStatusException(HttpStatus.NOT_FOUND,
				"Erro ao alterar dados do Aluno com id " + alunoId);
	}

	@DeleteMapping(value = "/api/aluno/{id}")
	void deleteAluno(@PathVariable long id) {
		alunoRepo.deleteById(id);
	}
}
